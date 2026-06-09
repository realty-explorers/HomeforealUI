terraform {
  backend "s3" {
    bucket         = "realty-explorers-tfstate"
    key            = "homeforeal-ui/terraform.tfstate"
    region         = "eu-north-1"
    use_lockfile   = true
    encrypt        = true
  }
}
