# Local
provider "kubernetes" {
 config_context = "minikube"
}

locals {
 backend_labels = {
   App = "wordpress"
   Tier = "frontend"
 }
 mysql_labels = {
   App = "wordpress"
   Tier = "mysql"
 }
}

# Static
# provider "kubernetes" {
#   host = "https://104.196.242.174"

#   client_certificate     = "${file("~/.kube/client-cert.pem")}"
#   client_key             = "${file("~/.kube/client-key.pem")}"
#   cluster_ca_certificate = "${file("~/.kube/cluster-ca-cert.pem")}"
# }

# Dynamic
# provider "kubernetes" {
#   config_path = "~/.kube/config"
# }