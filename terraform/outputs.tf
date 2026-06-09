output "ecr_repository_url" {
  description = "ECR URL for the frontend Docker image"
  value       = aws_ecr_repository.this.repository_url
}

output "ecs_service_name" {
  value = aws_ecs_service.this.name
}
