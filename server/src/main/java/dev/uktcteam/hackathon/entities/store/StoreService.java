package dev.uktcteam.hackathon.entities.store;

import dev.uktcteam.hackathon.entities.itemcoordinate.ItemCoordinate;
import dev.uktcteam.hackathon.entities.itemcoordinate.ItemCoordinateDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    public StoreDto getStore(Long id) {
        Store store = storeRepository.findById(id).orElse(null);
        if (store == null) {
            return null;
        }

        StoreDto storeDto = new StoreDto();
        storeDto.setId(store.getId());
        storeDto.setName(store.getName());
        storeDto.setDescription(store.getDescription());
        storeDto.setAddress(store.getAddress());

        int maxX = 0;
        int maxY = 0;
        for (ItemCoordinate item : store.getItemCoordinates()) {
            maxX = Math.max(maxX, item.getX());
            maxY = Math.max(maxY, item.getY());
        }

        ItemCoordinateDetailsDto[][] itemDetails = new ItemCoordinateDetailsDto[maxX+1][maxY+1];
        for (ItemCoordinate item : store.getItemCoordinates()) {
            ItemCoordinateDetailsDto itemCoordinateDetailsDto = new ItemCoordinateDetailsDto();

            if (item.isProduct()) {
                itemCoordinateDetailsDto.setIndentifierAndId(
                        "P" + item.getProduct().getId().toString()
                );
                itemCoordinateDetailsDto.setCategory(
                        item.getProduct()
                                .getCategory()
                                .getName()
                );
            } else if (item.isCheckout()) {
                itemCoordinateDetailsDto.setIndentifierAndId(
                        "C"
                );
                itemCoordinateDetailsDto.setCategory(item.getCheckout().getName());
            } else if (item.isTrafficFlow()) {
                itemCoordinateDetailsDto.setIndentifierAndId(
                        "TF"
                );
                itemCoordinateDetailsDto.setCategory(item.getTrafficFlow().getName());
            }

            itemDetails[item.getX()][item.getY()] = itemCoordinateDetailsDto;
        }

        storeDto.setItemDetails(itemDetails);

        return storeDto;
    }
}
