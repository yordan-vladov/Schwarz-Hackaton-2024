package dev.uktcteam.hackathon.pathfinding;

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

        long startTime = System.currentTimeMillis();

        String entrance = "EN";
        String[] goldenEggs = { "P107", "P310", "P204", "P19", "P279" };
        List<String> checkouts = new ArrayList<String>(exitToCheckoutsDistances.keySet());
        String exit = "EX";

        CompletableFuture<ArrayList<String>> shortestRouteFuture = CompletableFuture.supplyAsync(() ->
                routeOptimizer.findShortestRoute(entrance, exit, products, checkouts,
                        shortestDistances, productToCheckoutDistances, entranceToProductsDistances, exitToCheckoutsDistances));

        CompletableFuture<ArrayList<String>> shortestRouteWithGoldenEggFuture = shortestRouteFuture.thenApplyAsync(route ->
                routeOptimizer.insertBestGoldenEgg(route, goldenEggs, shortestDistances));

        CompletableFuture<ArrayList<String>> optimizedRouteFuture = shortestRouteWithGoldenEggFuture.thenApplyAsync(route ->
                routeOptimizer.twoOpt(route, shortestDistances, productToCheckoutDistances,
                        entranceToProductsDistances, exitToCheckoutsDistances));

        CompletableFuture<Integer> totalDistanceFuture = optimizedRouteFuture.thenApplyAsync(route ->
                routeOptimizer.calculateRouteDistance(route, shortestDistances, productToCheckoutDistances,
                        entranceToProductsDistances, exitToCheckoutsDistances));

        ArrayList<String> optimizedRoute = shortestRouteWithGoldenEggFuture.join();
        int totalDistance = totalDistanceFuture.join();

        ArrayList<List<int[]>> shortestRoutePath = routeOptimizer.getShortestRoutePath(coordinateMatrix.extractMatrix(), optimizedRoute);

        long endTime = System.currentTimeMillis();
        long elapsedTime = endTime - startTime;
        System.out.println("Elapsed time: " + elapsedTime + " milliseconds");

        TwoPointPathDto[] pathfind = new TwoPointPathDto[shortestRoutePath.size()];
        for (int i = 0; i < shortestRoutePath.size(); i++) {
            List<int[]> path = shortestRoutePath.get(i);

            TwoPointPathDto twoPointPathDto = new TwoPointPathDto();

            PointDto startPoint = new PointDto();
            startPoint.setX(path.get(0)[0]);
            startPoint.setY(path.get(0)[1]);
            startPoint.setId(optimizedRoute.get(i)); // Set the ID
            twoPointPathDto.setStart(startPoint);

            PointDto endPoint = new PointDto();
            endPoint.setX(path.get(path.size() - 1)[0]);
            endPoint.setY(path.get(path.size() - 1)[1]);
            endPoint.setId(optimizedRoute.get(i + 1)); // Set the ID
            twoPointPathDto.setEnd(endPoint);

            Point[] points = new Point[path.size() - 2];
            for (int j = 1; j < path.size() - 1; j++) {
                points[j - 1] = new Point(path.get(j)[0], path.get(j)[1]);
            }
            twoPointPathDto.setPath(points);

            pathfind[i] = twoPointPathDto;
        }

        PathfindDto pathfindDto = PathfindDto.builder()
                .distance(totalDistance)
                .pathfind(pathfind)
                .build();

        return pathfindDto;
    }


}