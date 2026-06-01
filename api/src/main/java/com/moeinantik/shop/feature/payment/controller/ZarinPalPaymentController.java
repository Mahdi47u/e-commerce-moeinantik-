package com.moeinantik.shop.feature.payment.controller;

import com.moeinantik.shop.feature.payment.model.StartPaymentResponse;
import com.moeinantik.shop.feature.payment.service.ZarinPalPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments/zarinpal")
public class ZarinPalPaymentController {

    private final ZarinPalPaymentService paymentService;

    @PostMapping("/orders/{orderId}/start")
    public ResponseEntity<StartPaymentResponse> startPayment(
            Authentication authentication,
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(paymentService.startPayment(authentication, orderId));
    }

    @GetMapping("/callback")
    public RedirectView callback(
            @RequestParam("Authority") String authority,
            @RequestParam("Status") String status
    ) {
        return new RedirectView(paymentService.handleCallback(authority, status));
    }
}
