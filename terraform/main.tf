terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

locals {
  project  = var.project_name
  service  = "homeforeal-ui"
  port     = 3000
  base_url = data.aws_ssm_parameter.api_gateway_endpoint.value
}

# ── Read shared infra IDs from SSM ───────────────────────────────────────────

data "aws_ssm_parameter" "subnet_id"              { name = "/${local.project}/shared/public-subnet-id" }
data "aws_ssm_parameter" "cluster_name"           { name = "/${local.project}/shared/ecs-cluster-name" }
data "aws_ssm_parameter" "ecs_tasks_sg"           { name = "/${local.project}/shared/ecs-tasks-sg-id" }
data "aws_ssm_parameter" "api_gateway_id"         { name = "/${local.project}/shared/api-gateway-id" }
data "aws_ssm_parameter" "api_gateway_endpoint"   { name = "/${local.project}/shared/api-gateway-endpoint" }
data "aws_ssm_parameter" "vpc_link_id"            { name = "/${local.project}/shared/vpc-link-id" }
data "aws_ssm_parameter" "cloud_map_namespace_id" { name = "/${local.project}/shared/cloud-map-namespace-id" }

# ── ECR ───────────────────────────────────────────────────────────────────────

resource "aws_ecr_repository" "this" {
  name                 = "${local.project}/${local.service}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
  tags                 = { Name = "${local.project}/${local.service}" }
}

resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 3 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 3
      }
      action = { type = "expire" }
    }]
  })
}

# ── SSM Secrets ───────────────────────────────────────────────────────────────

resource "aws_ssm_parameter" "cognito_pool_id" {
  name  = "/${local.project}/${local.service}/COGNITO_USER_POOL_ID"
  type  = "SecureString"
  value = var.cognito_user_pool_id
}

resource "aws_ssm_parameter" "cognito_client_id" {
  name  = "/${local.project}/${local.service}/COGNITO_CLIENT_ID"
  type  = "SecureString"
  value = var.cognito_client_id
}

resource "aws_ssm_parameter" "cognito_client_secret" {
  name  = "/${local.project}/${local.service}/COGNITO_CLIENT_SECRET"
  type  = "SecureString"
  value = var.cognito_client_secret
}

resource "aws_ssm_parameter" "auth_secret" {
  name  = "/${local.project}/${local.service}/AUTH_SECRET"
  type  = "SecureString"
  value = var.auth_secret
}

resource "aws_ssm_parameter" "mapbox_api_key" {
  name  = "/${local.project}/${local.service}/NEXT_PUBLIC_MAPBOX_API_KEY"
  type  = "SecureString"
  value = var.mapbox_api_key
}

resource "aws_ssm_parameter" "google_api_key" {
  name  = "/${local.project}/${local.service}/NEXT_PUBLIC_GOOGLE_API_KEY"
  type  = "SecureString"
  value = var.google_api_key
}

resource "aws_ssm_parameter" "posthog_key" {
  name  = "/${local.project}/${local.service}/NEXT_PUBLIC_POSTHOG_KEY"
  type  = "SecureString"
  value = var.posthog_key
}

resource "aws_ssm_parameter" "ably_api_key" {
  name  = "/${local.project}/${local.service}/ABLY_API_KEY"
  type  = "SecureString"
  value = var.ably_api_key
}

resource "aws_ssm_parameter" "projo_api_key" {
  name  = "/${local.project}/${local.service}/PROJO_API_KEY"
  type  = "SecureString"
  value = var.projo_api_key
}

# ── IAM Roles ─────────────────────────────────────────────────────────────────

resource "aws_iam_role" "exec" {
  name = "${local.project}-${local.service}-exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "exec" {
  role       = aws_iam_role.exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "exec_ssm" {
  name = "ssm-read-secrets"
  role = aws_iam_role.exec.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ssm:GetParameter", "ssm:GetParameters"]
      Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${local.project}/${local.service}/*"
    }]
  })
}

resource "aws_iam_role" "task" {
  name = "${local.project}-${local.service}-task"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# ── CloudWatch Logs ───────────────────────────────────────────────────────────

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${local.project}/${local.service}"
  retention_in_days = 14
}

# ── ECS Task Definition ───────────────────────────────────────────────────────

resource "aws_ecs_task_definition" "this" {
  family                   = "${local.project}-${local.service}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.exec.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([{
    name  = local.service
    image = "${aws_ecr_repository.this.repository_url}:latest"

    portMappings = [{
      containerPort = local.port
      protocol      = "tcp"
    }]

    environment = [
      { name = "NODE_ENV",                          value = "production" },
      { name = "PORT",                              value = tostring(local.port) },
      { name = "COGNITO_REGION",                    value = var.cognito_region },
      { name = "COGNITO_DOMAIN",                    value = var.cognito_domain },
      { name = "COGNITO_ISSUER",                    value = "https://cognito-idp.${var.cognito_region}.amazonaws.com/${var.cognito_user_pool_id}" },
      { name = "NEXT_PUBLIC_BUYBOX_API_URL",         value = "${local.base_url}/v1/buybox" },
      { name = "NEXT_PUBLIC_ANALYSIS_API_URL",       value = "${local.base_url}/v1/analysis" },
      { name = "NEXT_PUBLIC_DEALS_SERVICE_HOST",     value = "${local.base_url}/v1/scraper" },
      { name = "NEXT_PUBLIC_USER_SERVICE_URL",       value = "${local.base_url}/v1/user" },
      { name = "NEXT_PUBLIC_OFFER_SERVICE_URL",      value = "${local.base_url}/v1/offer" },
      { name = "NEXT_PUBLIC_POSTHOG_HOST",           value = var.posthog_host },
      { name = "NEXT_PUBLIC_ALLOWED_STATES",         value = "NY,NJ,OH,CT" },
      { name = "NEXT_PUBLIC_ALLOWED_LOCATION_TYPES", value = "city,zip" }
    ]

    secrets = [
      { name = "COGNITO_USER_POOL_ID",              valueFrom = aws_ssm_parameter.cognito_pool_id.arn },
      { name = "COGNITO_CLIENT_ID",                 valueFrom = aws_ssm_parameter.cognito_client_id.arn },
      { name = "COGNITO_CLIENT_SECRET",             valueFrom = aws_ssm_parameter.cognito_client_secret.arn },
      { name = "AUTH_SECRET",                       valueFrom = aws_ssm_parameter.auth_secret.arn },
      { name = "NEXT_PUBLIC_MAPBOX_API_KEY",        valueFrom = aws_ssm_parameter.mapbox_api_key.arn },
      { name = "NEXT_PUBLIC_GOOGLE_API_KEY",        valueFrom = aws_ssm_parameter.google_api_key.arn },
      { name = "NEXT_PUBLIC_POSTHOG_KEY",           valueFrom = aws_ssm_parameter.posthog_key.arn },
      { name = "ABLY_API_KEY",                      valueFrom = aws_ssm_parameter.ably_api_key.arn },
      { name = "PROJO_API_KEY",                     valueFrom = aws_ssm_parameter.projo_api_key.arn }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.this.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${local.port}/api/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 90
    }
  }])
}

# ── Cloud Map Service Registration ───────────────────────────────────────────

resource "aws_service_discovery_service" "this" {
  name = local.service

  dns_config {
    namespace_id   = data.aws_ssm_parameter.cloud_map_namespace_id.value
    routing_policy = "MULTIVALUE"
    dns_records {
      ttl  = 10
      type = "A"
    }
    dns_records {
      ttl  = 10
      type = "SRV"
    }
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ── API Gateway Default Route (catch-all → UI) ────────────────────────────────

resource "aws_apigatewayv2_integration" "this" {
  api_id             = data.aws_ssm_parameter.api_gateway_id.value
  integration_type   = "HTTP_PROXY"
  integration_method = "ANY"
  integration_uri    = aws_service_discovery_service.this.arn
  connection_type    = "VPC_LINK"
  connection_id      = data.aws_ssm_parameter.vpc_link_id.value
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = data.aws_ssm_parameter.api_gateway_id.value
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
}

# ── ECS Service ───────────────────────────────────────────────────────────────

resource "aws_ecs_service" "this" {
  name            = local.service
  cluster         = data.aws_ssm_parameter.cluster_name.value
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
    base              = 0
  }

  network_configuration {
    subnets          = [data.aws_ssm_parameter.subnet_id.value]
    security_groups  = [data.aws_ssm_parameter.ecs_tasks_sg.value]
    assign_public_ip = true
  }

  service_registries {
    registry_arn   = aws_service_discovery_service.this.arn
    container_name = local.service
    container_port = local.port
  }
}
