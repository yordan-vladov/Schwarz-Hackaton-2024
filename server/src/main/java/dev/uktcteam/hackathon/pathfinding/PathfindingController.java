package dev.uktcteam.hackathon.pathfinding;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/pathfind")
@RequiredArgsConstructor
public class PathfindingController {

    private final PathfindingService pathfindingService;

    @GetMapping("{storeId}")
    public PathfindDto findPath(
            @RequestBody String[] products
    ) {
        return pathfindingService.findPath(products);
    }

}
