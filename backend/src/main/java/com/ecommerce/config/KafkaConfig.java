package com.ecommerce.config; import org.apache.kafka.clients.admin.NewTopic; import org.springframework.context.annotation.*;
@Configuration public class KafkaConfig { @Bean NewTopic orderEvents(){return new NewTopic("order-events",3,(short)1);} }
