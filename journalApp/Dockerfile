FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src


RUN mkdir -p src/main/resources && cat > src/main/resources/application.properties << 'EOF'
spring.application.name=journalApp
spring.data.mongodb.uri=${MONGO_URI}
jwt.secret=journalapp_super_secure_hs512_secret_key_at_least_64_chars_long_2026
jwt.expiration=86400000
EOF

RUN mvn package -DskipTests=true -B

FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]