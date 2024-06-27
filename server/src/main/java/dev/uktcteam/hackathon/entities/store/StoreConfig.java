package dev.uktcteam.hackathon.entities.store;

import dev.uktcteam.hackathon.entities.checkout.Checkout;
import dev.uktcteam.hackathon.entities.checkout.CheckoutRepository;
import dev.uktcteam.hackathon.entities.itemcoordinate.ItemCoordinate;
import dev.uktcteam.hackathon.entities.itemcoordinate.ItemCoordinateRepository;
import dev.uktcteam.hackathon.entities.product.Product;
import dev.uktcteam.hackathon.entities.product.ProductRepository;
import dev.uktcteam.hackathon.entities.trafficflow.TrafficFlow;
import dev.uktcteam.hackathon.entities.trafficflow.TrafficFlowRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.FileReader;
import java.io.Reader;

@Component
@Order(4)
public class StoreConfig implements CommandLineRunner {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private ItemCoordinateRepository itemCoordinateRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CheckoutRepository checkoutRepository;

    @Autowired
    private TrafficFlowRepository trafficFlowRepository;

    @Override
    public void run(String... args) throws Exception {

        Store store = new Store();
        store.setName("test store");
        store.setAddress("test address");
        store.setDescription("test description");
        storeRepository.save(store);

        Reader in = new FileReader(new ClassPathResource("csv-data/placement.csv").getFile());
        Iterable<CSVRecord> records = CSVFormat.DEFAULT
                .withHeader("product_id", "x", "y")
                .withFirstRecordAsHeader()
                .parse(in);

        for (CSVRecord record : records) {
            String productId = record.get("product_id");
            int x = Integer.parseInt(record.get("x"));
            int y = Integer.parseInt(record.get("y"));

            ItemCoordinate itemCoordinate = new ItemCoordinate();
            itemCoordinate.setX(x);
            itemCoordinate.setY(y);
            itemCoordinate.setStore(store);

            if (productId.startsWith("CA")) {
                checkoutRepository.findById(1L).ifPresent(itemCoordinate::setCheckout);
            } else if (productId.startsWith("S")) {
                checkoutRepository.findById(2L).ifPresent(itemCoordinate::setCheckout);
            } else if (productId.startsWith("BL")) {
                trafficFlowRepository.findById(3L).ifPresent(itemCoordinate::setTrafficFlow);
            } else if (productId.startsWith("EN")) {
                trafficFlowRepository.findById(1L).ifPresent(itemCoordinate::setTrafficFlow);
            } else if (productId.startsWith("EX")) {
                trafficFlowRepository.findById(2L).ifPresent(itemCoordinate::setTrafficFlow);
            } else if (productId.startsWith("P")) {
                productRepository.findById(Long.parseLong(productId.substring(1))).ifPresent(itemCoordinate::setProduct);
            } else {
                System.out.println("ERROR AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            }

            itemCoordinateRepository.save(itemCoordinate);
            store.getItemCoordinates().add(itemCoordinate);
        }

        storeRepository.save(store);
    }
}