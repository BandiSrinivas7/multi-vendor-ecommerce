package com.ecommerce.seller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.common.ApiException;
import com.ecommerce.user.User;
import com.ecommerce.user.UserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/v1/seller")
public class SellerController {

    public record Req(@NotBlank String businessName, String gstNumber) {}

    private final SellerRepository sellers;
    private final UserRepository users;

    public SellerController(SellerRepository s, UserRepository u) {
        sellers = s;
        users = u;
    }

    @PostMapping("/profile")
    public SellerProfile create(@RequestBody @Valid Req r, Authentication a) {
        User u = users.findByEmailIgnoreCase(a.getName()).orElseThrow();

        if (u.getRole() != User.Role.SELLER) {
            throw new ApiException("Seller role required");
        }
        if (sellers.findByUserId(u.getId()).isPresent()) {
            throw new ApiException("Seller profile already exists");
        }

        SellerProfile s = new SellerProfile();
        s.setUser(u);
        s.setBusinessName(r.businessName());
        s.setGstNumber(r.gstNumber());
        return sellers.save(s);
    }

    @GetMapping("/profile")
    public SellerProfile profile(Authentication a) {
        User u = users.findByEmailIgnoreCase(a.getName()).orElseThrow();
        return sellers.findByUserId(u.getId())
                .orElseThrow(() -> new ApiException("Seller profile not found"));
    }
}