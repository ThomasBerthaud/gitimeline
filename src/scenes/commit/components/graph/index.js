import React, { Component } from "react";
import * as d3 from "d3";
import GitHubColors from "github-colors";

export default class Graph extends Component {
  displayGraph(commit) {
    let svg = d3.select("svg"),
      margin = 20,
      width = +svg.style("width").slice(0, -2),
      height = +svg.style("height").slice(0, -2),
      diameter = width > height ? height : width,
      toDelete = svg.select("g");

    let g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          ((width - diameter) / 2 + diameter / 2) +
          "," +
          ((height - diameter) / 2 + diameter / 2) +
          ")"
      );

    let color = d3
      .scaleLinear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    let pack = d3
      .pack()
      .size([diameter - margin, diameter - margin])
      .padding(2);

    let root = d3
      .hierarchy(commit)
      .sum(function(d) {
        return d.size;
      })
      .sort(function(a, b) {
        return b.name - a.name;
      });

    let focus = root,
      nodes = pack(root).descendants(),
      view;

    let circle = g
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", function(d) {
        return d.parent
          ? d.children ? "node" : "node node--leaf"
          : "node node--root";
      })
      .style("fill", function(d) {
        return d.children ? color(d.depth) : calcColor(d.data.name);
      })
      .on("click", function(d) {
        if (focus !== d) {
          zoom(d);
          d3.event.stopPropagation();
        }
      });

    g
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) {
        return d.parent === root ? 1 : 0;
      })
      .style("display", function(d) {
        return d.parent === root ? "inline" : "none";
      })
      .text(function(d) {
        return d.data.name;
      });

    let node = g.selectAll("circle,text");

    svg.on("click", function() {
      zoom(root);
    });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    toDelete.remove();

    function zoomTo(v) {
      let k = diameter / v[2];
      view = v;
      node.attr("transform", function(d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
      });
      circle.attr("r", function(d) {
        return d.r * k;
      });
    }
    function zoom(d) {
      if (d.children) {
        focus = d;

        let transition = d3
          .transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            let i = d3.interpolateZoom(view, [
              focus.x,
              focus.y,
              focus.r * 2 + margin
            ]);
            return function(t) {
              zoomTo(i(t));
            };
          });

        transition
          .selectAll("text")
          .filter(function(d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .style("fill-opacity", function(d) {
            return d.parent === focus ? 1 : 0;
          })
          .on("start", function(d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function(d) {
            if (d.parent !== focus) this.style.display = "none";
          });
      }
    }
  }

  render() {
    if(this.props.commit) this.displayGraph(this.props.commit);
    return <svg width="100%" height="100%" />;
  }
}


//HELPER FUNCTION ////////////////////////////
function calcColor(name) {
  if (name) {
    let ext = name.split(".")[name.split(".").length - 1];
    if (GitHubColors[ext] && GitHubColors[ext].color) {
      return GitHubColors[ext].color;
    }
  }
  return "#ccc";
}