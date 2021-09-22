FROM golang:latest

WORKDIR /app

COPY . .
#RUN apt-get install sl
RUN go mod download

RUN go build -o /main

ENV PORT=:8000 

EXPOSE 8000

CMD [ "/main"]

