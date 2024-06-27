package dev.uktcteam.hackathon.entities.product;

import lombok.Builder;
import lombok.Data;

@Data
public class ProductDto {
    private Long productId;
    private String name;
    private double price;
    private String image;
    private Long coordinateId;
    private Long categoryId;
    private boolean isGolden;

    ProductDto(Product product){
        this.productId = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.image = product.getImage();
        this.coordinateId = product.getItemCoordinates().get(0).getId();
        this.categoryId = product.getCategory().getId();
        this.isGolden = product.getIsGolden();
    }
}

