package com.ecommerce.user;
import com.fasterxml.jackson.annotation.JsonIgnore; import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="users") public class User {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @Column(nullable=false,length=120) private String name; @Column(nullable=false,unique=true) private String email;
 @Column(name="password_hash",nullable=false) private String passwordHash; @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role=Role.CUSTOMER; @Enumerated(EnumType.STRING) @Column(nullable=false) private Status status=Status.ACTIVE;
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt; @Column(name="updated_at",nullable=false) private Instant updatedAt;
 @PrePersist void c(){createdAt=Instant.now();updatedAt=createdAt;} @PreUpdate void u(){updatedAt=Instant.now();}
 public UUID getId(){return id;} public String getName(){return name;} public String getEmail(){return email;} @JsonIgnore public String getPasswordHash(){return passwordHash;} public Role getRole(){return role;} public Status getStatus(){return status;}
 public void setName(String v){name=v;} public void setEmail(String v){email=v;} public void setPasswordHash(String v){passwordHash=v;} public void setRole(Role v){role=v;} public void setStatus(Status v){status=v;}
 public enum Role{CUSTOMER,SELLER,ADMIN} public enum Status{ACTIVE,INACTIVE,BLOCKED}
}
