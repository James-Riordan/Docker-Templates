resource "kubernetes_service" "example" {
  metadata {
    name = "ingress-service"
  }
  spec {
    port {
      port = 80
      target_port = 80
      protocol = "TCP"
    }
    type = "NodePort"
  }
}

resource "kubernetes_ingress" "example" {
  wait_for_load_balancer = true
  metadata {
    name = "example"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
    }
  }
  spec {
    rule {
      http {
        path {
          path = "/*"
          backend {
            service_name = kubernetes_service.example.metadata.0.name
            service_port = 80
          }
        }
      }
    }
  }
}

# Display load balancer hostname (typically present in AWS)
output "load_balancer_hostname" {
  value = kubernetes_ingress.example.status.0.load_balancer.0.ingress.0.hostname
}

# Display load balancer IP (typically present in GCP, or using Nginx ingress controller)
output "load_balancer_ip" {
  value = kubernetes_ingress.example.status.0.load_balancer.0.ingress.0.ip
}
/*resource "kubernetes_ingress" "example_ingress" {
  metadata {
    name = "ingress-service"
  }
  spec {
    port {
      port = 80
      target_port = 80
      protocol = "TCP"
    }
    type = "NodePort"
  }
}

  spec {
    backend {
      service_name = "BackendApp"
      service_port = 8080
    }
    mongo {
      service_name = "MongoApp"
      service_port = 27017
    }
    redis {
      service_name = "Redis"
      service_port = 6739
    }

    rule {
      http {
        path {
          backend {
            service_name = "BackendApp"
            service_port = 8080
          }

          path = "/*"
        }

        path {
          mongo {
            service_name = "MongoApp"
            service_port = 27017
          }

          path = "/*"
        }
         path {
          mongo {
            service_name = "RedisApp"
            service_port = 6739
          }

          path = "/*"
        }
      }
    }

    tls {
      secret_name = "tls-secret"
    }
  }
}

resource "kubernetes_pod" "example" {
  metadata {
    name = "terraform-example"
    labels = {
      app = "BackendApp"
    }
  }

  spec {
    container {
      image = "megaserver/backend:latest"
      name  = "example"

      port {
        container_port = 8080
      }
    }
  }
}

resource "kubernetes_pod" "example2" {
  metadata {
    name = "terraform-example2"
    labels = {
      app = "MongoApp"
    }
  }

  spec {
    container {
      image = "mongo"
      name  = "example"

      port {
        container_port = 27017
      }
    }
  }
}
resource "kubernetes_pod" "example3" {
  metadata {
    name = "terraform-example3"
    labels = {
      app = "RedisApp"
    }
  }

  spec {
    container {
      image = "redis"
      name  = "example"

      port {
        container_port = 6739
      }
    }
  }
}*/