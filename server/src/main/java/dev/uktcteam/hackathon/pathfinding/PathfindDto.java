package dev.uktcteam.hackathon.pathfinding;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PathfindDto {

    private Integer distance;

    private TwoPointPathDto[] pathfind;

}
