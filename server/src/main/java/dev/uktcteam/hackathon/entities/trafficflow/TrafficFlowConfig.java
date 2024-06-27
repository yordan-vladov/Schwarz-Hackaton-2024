package dev.uktcteam.hackathon.entities.trafficflow;

import dev.uktcteam.hackathon.entities.checkout.Checkout;
import dev.uktcteam.hackathon.entities.checkout.CheckoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class TrafficFlowConfig implements CommandLineRunner {

    @Autowired
    private TrafficFlowRepository trafficFlowRepository;


    @Override
    public void run(String... args) throws Exception {
        TrafficFlow flow = TrafficFlow.builder()
                .name("Entry")
                .build();
        trafficFlowRepository.save(flow);

        TrafficFlow flow2 = TrafficFlow.builder()
                .name("Exit")
                .build();
        trafficFlowRepository.save(flow2);

        TrafficFlow flow3 = TrafficFlow.builder()
                .name("BlockedPath")
                .build();
        trafficFlowRepository.save(flow3);
    }
}

