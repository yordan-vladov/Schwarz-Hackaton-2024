package dev.uktcteam.hackathon.pathfinding.logic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RouteOptimizer {

    private final CoordinateMatrix coordinateMatrix;

    @Autowired
    private HashMapUtils hashMapUtils;

    @Autowired
    public RouteOptimizer(CoordinateMatrix coordinateMatrix) {
        this.coordinateMatrix = coordinateMatrix;
    }

    public int calculateRouteDistance(ArrayList<String> route,
                                      HashMap<Pair, Integer> shortestDistances,
                                      HashMap<Pair, Integer> productToCheckoutDistances,
                                      HashMap<String, Integer> entranceToProductsDistances,
                                      HashMap<String, Integer> exitToCheckoutsDistances) {
        int totalDistance = 0;

        totalDistance += entranceToProductsDistances.get(route.get(1));

        for (int i = 1; i < route.size() - 3; i++) {
            Pair pair = new Pair(route.get(i), route.get(i + 1));
            totalDistance += shortestDistances.get(pair);
        }

        Pair lastProductToCheckout = new Pair(route.get(route.size() - 3), route.get(route.size() - 2));
        totalDistance += productToCheckoutDistances.get(lastProductToCheckout);

        totalDistance += exitToCheckoutsDistances.get(route.get(route.size() - 2));

        return totalDistance;
    }

    public ArrayList<String> findShortestRoute(String entrance, String exit, String[] products,
                                               List<String> checkouts,
                                               HashMap<Pair, Integer> shortestDistances,
                                               HashMap<Pair, Integer> productToCheckoutDistances,
                                               HashMap<String, Integer> entranceToProductsDistances,
                                               HashMap<String, Integer> exitToCheckoutsDistances) {

        ArrayList<String> route = new ArrayList<>();
        route.add(entrance);

        Set<String> remainingProducts = new HashSet<>(Arrays.asList(products));

        String currentLocation = entrance;

        while (!remainingProducts.isEmpty()) {
            String nearestProduct = null;
            int shortestDistance = Integer.MAX_VALUE;

            for (String product : remainingProducts) {
                int distance = entranceToProductsDistances.getOrDefault(product, Integer.MAX_VALUE);
                if (distance < shortestDistance) {
                    nearestProduct = product;
                    shortestDistance = distance;
                }
            }

            route.add(nearestProduct);
            remainingProducts.remove(nearestProduct);
            currentLocation = nearestProduct;
        }

        String nearestCheckout = null;
        int shortestCheckoutDistance = Integer.MAX_VALUE;

        for (String checkout : checkouts) {
            Pair pair = new Pair(currentLocation, checkout);
            int distance = productToCheckoutDistances.getOrDefault(pair, Integer.MAX_VALUE);
            if (distance < shortestCheckoutDistance) {
                nearestCheckout = checkout;
                shortestCheckoutDistance = distance;
            }
        }

        route.add(nearestCheckout);

        route.add(exit);

        return route;
    }

    public ArrayList<String> insertBestGoldenEgg(ArrayList<String> route, String[] goldenEggs,
                                                 HashMap<Pair, Integer> shortestDistances) {
        int minimalIncrease = Integer.MAX_VALUE;
        String bestGoldenEgg = null;
        int bestPosition = -1;

        for (String goldenEgg : goldenEggs) {
            for (int i = 1; i < route.size() - 2; i++) {
                String current = route.get(i);
                String next = route.get(i + 1);
                Pair currentToGoldenEgg = new Pair(current, goldenEgg);
                Pair goldenEggToNext = new Pair(goldenEgg, next);
                Pair currentToNext = new Pair(current, next);

                if (!shortestDistances.containsKey(currentToGoldenEgg)
                        || !shortestDistances.containsKey(goldenEggToNext)) {
                    continue;
                }
                int increase = shortestDistances.get(currentToGoldenEgg) + shortestDistances.get(goldenEggToNext)
                        - shortestDistances.get(currentToNext);

                if (increase < minimalIncrease) {
                    minimalIncrease = increase;
                    bestGoldenEgg = goldenEgg;
                    bestPosition = i + 1;
                }
            }
        }

        if (bestGoldenEgg != null && bestPosition != -1) {
            route.add(bestPosition, bestGoldenEgg);
        }

        return route;
    }

    public ArrayList<List<int[]>> getShortestRoutePath(String[][] matrix, ArrayList<String> shortestRoute) {

        Set<String> elementsSet = new HashSet<>(shortestRoute);

        HashMap<String, int[]> elementCoords = new HashMap<>();

        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                if (elementsSet.contains(matrix[i][j])) {
                    elementCoords.put(matrix[i][j], new int[] { i, j });
                }
            }
        }

        ArrayList<List<int[]>> shortestRoutePath = new ArrayList<>();

        for (int index = 0; index < shortestRoute.size() - 1; index++) {
            List<int[]> path = coordinateMatrix.bfsWithPath(matrix, elementCoords.get(shortestRoute.get(index)),
                    elementCoords.get(shortestRoute.get(index + 1)));
            shortestRoutePath.add(path);
        }
        return shortestRoutePath;
    }

    public ArrayList<String> twoOpt(ArrayList<String> route,
                                    HashMap<Pair, Integer> shortestDistances,
                                    HashMap<Pair, Integer> productToCheckoutDistances,
                                    HashMap<String, Integer> entranceToProductsDistances,
                                    HashMap<String, Integer> exitToCheckoutsDistances) {
        boolean improved = true;
        int currentDistance = calculateRouteDistance(route, shortestDistances, productToCheckoutDistances,
                entranceToProductsDistances, exitToCheckoutsDistances);

        while (improved) {
            improved = false;
            for (int i = 1; i < route.size() - 3; i++) {
                for (int j = i + 1; j < route.size() - 2; j++) {
                    reverseSublist(route, i, j);
                    int newDistance = calculateRouteDistance(route, shortestDistances, productToCheckoutDistances,
                            entranceToProductsDistances, exitToCheckoutsDistances);

                    if (newDistance < currentDistance) {
                        currentDistance = newDistance;
                        improved = true;
                    } else {
                        reverseSublist(route, i, j); // revert the swap
                    }
                }
            }
        }
        return route;
    }

    private void reverseSublist(ArrayList<String> route, int i, int j) {
        while (i < j) {
            String temp = route.get(i);
            route.set(i, route.get(j));
            route.set(j, temp);
            i++;
            j--;
        }
    }

    public ArrayList<List<int[]>> optimiseRoute(String[] products) {

        HashMap<Pair, Integer> shortestDistances = hashMapUtils
                .extractDistancePairHashMapFromFile("shortestDistances.json");

        HashMap<Pair, Integer> productToCheckoutDistances = hashMapUtils
                .extractDistancePairHashMapFromFile("productToCheckoutDistances.json");

        HashMap<String, Integer> entranceToProductsDistances = hashMapUtils
                .extractDistanceHashMapFromFile("entranceToProductsDistances.json");

        HashMap<String, Integer> exitToCheckoutsDistances = hashMapUtils
                .extractDistanceHashMapFromFile("exitToCheckoutsDistances.json");

        String entrance = "EN";

        String[] goldenEggs = { "P107", "P310", "P204", "P19", "P279" };

        List<String> checkouts = new ArrayList<>(exitToCheckoutsDistances.keySet());

        String exit = "EX";

        ArrayList<String> shortestRoute = findShortestRoute(entrance, exit, products, checkouts,
                shortestDistances, productToCheckoutDistances, entranceToProductsDistances, exitToCheckoutsDistances);

        shortestRoute = insertBestGoldenEgg(shortestRoute, goldenEggs, shortestDistances);

        shortestRoute = twoOpt(shortestRoute, shortestDistances, productToCheckoutDistances,
                entranceToProductsDistances, exitToCheckoutsDistances);

        int totalDistance = calculateRouteDistance(shortestRoute, shortestDistances, productToCheckoutDistances,
                entranceToProductsDistances, exitToCheckoutsDistances);

        System.out.println("Optimized Route: " + shortestRoute);
        System.out.println("Total Distance: " + totalDistance);

        return getShortestRoutePath(coordinateMatrix.extractMatrix(), shortestRoute);
    }
}

