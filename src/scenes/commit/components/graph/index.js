import React, { Component } from "react";
import * as d3 from "d3";
import GitHubColors from "github-colors";
import "./styles.css";

export default class Graph extends Component {
  getColor = this.getColor.bind(this);
  mouseOverGraph = this.mouseOverGraph.bind(this);

  componentDidMount() {
    this.displayGraph();
  }

  componentDidUpdate() {
    this.displayGraph();
  }

  getColor(name) {
    const fileExtension = name.split(".")[name.split(".").length - 1];
    return GitHubColors.ext(fileExtension, true).color;
  }

  displayGraph() {
    const commit = this.props.commit;
    const breadcrumb = this.breadcrumb;
    if (!commit) return;

    // Dimensions of sunburst.
    const width = window.innerWidth - 5;
    const height = window.innerHeight - 70 - 55;
    const radius = Math.min(width, height) / 2;

    //remove old
    d3.select("#chart svg").remove();

    const vis = d3
      .select("#chart")
      .append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("id", "container")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    vis
      .append("svg:circle") //hidden circle for mouse events
      .attr("r", radius)
      .style("opacity", 0);

    const arc = d3
      .arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => Math.sqrt(d.y0))
      .outerRadius(d => Math.sqrt(d.y1));

    //Breadcrumbs
    // Add the svg area.
    d3
      .select(breadcrumb)
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail")
      .append("svg:text") //end label
      .attr("id", "endlabel")
      .style("fill", "#000");

    const partition = d3.partition().size([2 * Math.PI, radius * radius]);

    // Turn the data into a d3 hierarchy and calculate the sums.
    const root = d3
      .hierarchy(commit)
      .sum(d => d.size)
      .sort((a, b) => b.value - a.value);

    const nodes = partition(root).descendants();

    const path = vis
      .data([commit])
      .selectAll("path")
      .data(nodes)
      .enter()
      .append("svg:path")
      .attr("display", d => (d.depth ? null : "none"))
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", d => this.getColor(d.data.name))
      .style("opacity", 1);

    // Get total size of the tree = value of root node from partition.
    this.totalSize = path.datum().value;

    //add events
    path.on("mouseover", this.mouseOverGraph);
    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", d => this.mouseLeaveGraph(d));
  }

  mouseOverGraph(d, totalSize) {
    const fileName = d.data.name;
    const size = d.value;
    let centerText = `${size} / ${this.totalSize}`;
    d3.select("#file-name").text(fileName);
    d3.select("#percentage").text(centerText);
    d3.select("#explanation").style("visibility", "");
    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift(); // remove root node from the array
    this.updateBreadcrumbs(sequenceArray, size);

    // Fade all the segments.
    d3.selectAll("path").style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    d3
      .select("#chart")
      .selectAll("path")
      .filter(node => sequenceArray.indexOf(node) >= 0)
      .style("opacity", 1);
  }

  mouseLeaveGraph(d) {
    const mouseoverFn = this.mouseOverGraph;
    // Hide the breadcrumb trail
    d3.select("#trail").style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3
      .selectAll("path")
      .transition()
      .duration(800)
      .style("opacity", 1)
      .on("end", function() {
        d3.select(this).on("mouseover", mouseoverFn);
      });

    d3.select("#explanation").style("visibility", "hidden");
  }

  updateBreadcrumbs(nodeArray, hoveredElInfo) {
    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    const b = {
      w: 120,
      h: 30,
      s: 3,
      t: 10
    };
    // Generate a string that describes the points of a breadcrumb polygon.
    const breadcrumbPoints = (d, i) => {
      const points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + b.h / 2);
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) {
        // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + b.h / 2);
      }
      return points.join(" ");
    };

    // Data join; key function combines name and depth (= position in sequence).
    const trail = d3
      .select("#trail")
      .selectAll("g")
      .data(nodeArray, d => d.data.name + d.depth);

    // Remove exiting nodes.
    trail.exit().remove();

    // Add breadcrumb and label for entering nodes.
    const entering = trail.enter().append("svg:g");

    entering
      .append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", d => this.getColor(d.data.name));

    entering
      .append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => d.data.name);

    // Merge enter and update selections; set position for all nodes.
    entering
      .merge(trail)
      .attr("transform", (d, i) => "translate(" + i * (b.w + b.s) + ", 0)");

    // Now move and update the percentage at the end.
    d3
      .select("#trail")
      .select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(hoveredElInfo);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail").style("visibility", "");
  }

  render() {
    return (
      <div id="main">
        <div id="sequence">
          <svg ref={node => (this.breadcrumb = node)} />
        </div>
        <div id="chart">
          <div id="explanation" style={{ visibility: "hidden" }}>
            <div id="file-name" />
            <span id="percentage" />
            <br />
            Charactères
          </div>
        </div>
      </div>
    );
  }
}
