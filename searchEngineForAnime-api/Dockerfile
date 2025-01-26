# Use the base image for Java SDK 22
FROM openjdk:22-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY target/searchEngineForAnime-api-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set the entry point to run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
