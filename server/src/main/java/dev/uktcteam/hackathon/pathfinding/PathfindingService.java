package dev.uktcteam.hackathon.pathfinding;

import dev.uktcteam.hackathon.entities.product.ProductDto;
import dev.uktcteam.hackathon.entities.product.ProductService;
import dev.uktcteam.hackathon.pathfinding.logic.CoordinateMatrix;
import dev.uktcteam.hackathon.pathfinding.logic.HashMapUtils;
import dev.uktcteam.hackathon.pathfinding.logic.Pair;
import dev.uktcteam.hackathon.pathfinding.logic.RouteOptimizer;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class PathfindingService {

    @Autowired
    private RouteOptimizer routeOptimizer;

    @Autowired
    private CoordinateMatrix coordinateMatrix;

    @Autowired
    private HashMapUtils hashMapUtils;

    @Autowired
    private ProductService productService;

    private HashMap<Pair, Integer> shortestDistances;
    private HashMap<Pair, Integer> productToCheckoutDistances;
    private HashMap<String, Integer> entranceToProductsDistances;
    private HashMap<String, Integer> exitToCheckoutsDistances;


    @PostConstruct
    @DependsOn("hashMapUtils")
    public void init() {

        shortestDistances = hashMapUtils
                .extractDistancePairHashMapFromFile("src/main/resources/algorithm-caches/shortestDistances.json");

        productToCheckoutDistances = hashMapUtils
                .extractDistancePairHashMapFromFile("src/main/resources/algorithm-caches/productToCheckoutDistances.json");

        entranceToProductsDistances = hashMapUtils
                .extractDistanceHashMapFromFile("src/main/resources/algorithm-caches/entranceToProductsDistances.json");

        exitToCheckoutsDistances = hashMapUtils
                .extractDistanceHashMapFromFile("src/main/resources/algorithm-caches/exitToCheckoutsDistances.json");
    }

    public PathfindDto findPath(String[] products) {


        String entrance = "EN";

        String[] goldenEggs = { "P107", "P310", "P204", "P19", "P279" };

        List<String> checkouts = new ArrayList<String>(exitToCheckoutsDistances.keySet());

        String exit = "EX";


        // Find the shortest route using the nearest neighbor algorithm
        ArrayList<String> shortestRoute = routeOptimizer.findShortestRoute(entrance, exit, products, checkouts,
                shortestDistances, productToCheckoutDistances, entranceToProductsDistances, exitToCheckoutsDistances);

        // Insert the best golden egg that increases the route distance minimally
        shortestRoute = routeOptimizer.insertBestGoldenEgg(shortestRoute, goldenEggs, shortestDistances);

        // Optimize the route using 2-opt algorithm
        shortestRoute = routeOptimizer.twoOpt(shortestRoute, shortestDistances, productToCheckoutDistances,
                entranceToProductsDistances, exitToCheckoutsDistances);

        // Calculate the total distance of the optimized route
        int totalDistance = routeOptimizer.calculateRouteDistance(shortestRoute, shortestDistances, productToCheckoutDistances,
                entranceToProductsDistances, exitToCheckoutsDistances);

        // Get the shortest route path
        ArrayList<List<int[]>> shortestRoutePath = routeOptimizer.getShortestRoutePath(coordinateMatrix.extractMatrix(), shortestRoute);

        // Convert the shortest route path to an array of TwoPointPathDto objects
        TwoPointPathDto[] pathfind = new TwoPointPathDto[shortestRoutePath.size()];
        for (int i = 0; i < shortestRoutePath.size(); i++) {
            List<int[]> path = shortestRoutePath.get(i);

            // Create a new TwoPointPathDto object
            TwoPointPathDto twoPointPathDto = new TwoPointPathDto();

            // Set the start point
            PointDto startPoint = new PointDto();
            startPoint.setX(path.get(0)[0]);
            startPoint.setY(path.get(0)[1]);
            startPoint.setId(shortestRoute.get(i)); // Set the ID
            twoPointPathDto.setStart(startPoint);

            // Set the end point
            PointDto endPoint = new PointDto();
            endPoint.setX(path.get(path.size() - 1)[0]);
            endPoint.setY(path.get(path.size() - 1)[1]);
            endPoint.setId(shortestRoute.get(i + 1)); // Set the ID
            twoPointPathDto.setEnd(endPoint);

            // Set the path
            Point[] points = new Point[path.size() - 2];
            for (int j = 1; j < path.size() - 1; j++) {
                points[j - 1] = new Point(path.get(j)[0], path.get(j)[1]);
            }
            twoPointPathDto.setPath(points);

            // Add the TwoPointPathDto object to the array
            pathfind[i] = twoPointPathDto;
        }


        ProductDto[] sorted = new ProductDto[shortestRoute.size()];

        for (int i = 0; i < shortestRoute.size(); i++) {
            String productId = shortestRoute.get(i);
            if (productId.charAt(0) != 'P') {
                continue;
            }

            productId = shortestRoute.get(i).substring(1);
            ProductDto product = productService.getProductById(Long.parseLong(productId)); // or productRepository.findById(productId)
            sorted[i] = product;
        }


        PathfindDto pathfindDto = PathfindDto.builder()
                .distance(totalDistance)
                .sorted(sorted)
                .pathfind(pathfind)
                .build();

        return pathfindDto;
    }


}