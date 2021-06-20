# Node.js Global Mentoring Program

To run and get a result in /out directory
```bash
docker build . -t <image name>
docker run --name <container name> -d -v $PWD/out:/usr/src/app/out <image name>
```

or

```bash
docker-compose build
docker-compose up
```
