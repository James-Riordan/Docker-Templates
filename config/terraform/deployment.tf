resource "kubernetes_deployment" "megaserver" {
  metadata {
    name = "megaserver"
  }
  spec {
      selector {
        match_labels = {
            "app" = "megaserver"
        }
      }
      replicas = 2
      template {
        metadata {
            labels = {
                "app" = "megaserver"
            }
        }
        spec {
            container {
                name = "megaserver"
                image = "nginx-latest"
                port {
                    container_port = 80
                }
            }
        }
      }
  }
}
