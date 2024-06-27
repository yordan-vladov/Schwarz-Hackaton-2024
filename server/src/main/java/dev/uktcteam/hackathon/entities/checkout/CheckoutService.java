//package dev.uktcteam.hackathon.entities.checkout;
//
//import dev.uktcteam.hackathon.entities.itemcoordinate.ItemCoordinate;
//import dev.uktcteam.hackathon.entities.itemcoordinate.ItemCoordinateRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Service
//public class CheckoutService {
//
//    private final CheckoutRepository checkoutRepository;
//    private final ItemCoordinateRepository itemCoordinateRepository;
//
//    @Autowired
//    public CheckoutService(CheckoutRepository checkoutRepository, ItemCoordinateRepository itemCoordinateRepository) {
//        this.checkoutRepository = checkoutRepository;
//        this.itemCoordinateRepository = itemCoordinateRepository;
//    }
//
//    public Checkout createCheckout(String checkoutId, Long coordinateId) {
//        ItemCoordinate itemCoordinate = itemCoordinateRepository.findById(coordinateId)
//                .orElseThrow(() -> new RuntimeException("ItemCoordinate not found"));
//
//        Checkout checkout = Checkout.builder()
//                .checkoutId(checkoutId)
//                .itemCoordinate(itemCoordinate)
//                .build();
//
//        return checkoutRepository.save(checkout);
//    }
//
//    // Add more methods as per your application's requirements
//}
