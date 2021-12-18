# cleanup the minikube so we have a fresh slate for next run
echo "removing the minikube and resetting the environment"
kubectl delete service,statefulsets redis

kubectl delete configmaps redis-cluster-config

kubectl delete deployment backend

kubectl delete service redis-service

for i in `docker image ls | grep 'backend'`
  do docker rmi $i
done

# echo "stopping the minikube"
# minikube stop