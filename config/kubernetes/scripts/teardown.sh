#!/bin/sh
##
# Script to remove/undeploy all project resources from the local minikube environment.
##

# Delete mongod stateful set + mongodb service + secrets + host vm configure daemonset
kubectl delete statefulsets mongod
kubectl delete services mongodb-service
kubectl delete secret shared-bootstrap-data
sleep 3

# Delete persistent volume claims
kubectl delete persistentvolumeclaims -l role=mongo