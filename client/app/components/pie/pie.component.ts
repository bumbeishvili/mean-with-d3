import { Renderer, Component, ElementRef } from '@angular/core';
import * as d3 from "../../../../node_modules/d3/build/d3.js";
import { TaskService } from '../../services/task.services';
import { Task } from '../../../Task';

@Component({
  moduleId: module.id,
  selector: 'pie',
  templateUrl: 'pie.component.html'
})

export class PieComponent {
  tasks: Task[];
  dom: any = document.body;
  elementRef: ElementRef;

  constructor(elementRef: ElementRef, private renderer: Renderer, private taskService: TaskService) {
    this.elementRef = elementRef;



  }


  ngOnInit() {
    this.chartInit();
  }

  ngOnDestroy() {
    this.renderer.setElementClass(this.dom, 'is-not-scrollable', false);
  }

  chartInit() {

    var width, height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select(this.elementRef.nativeElement).select("#pieChartContainer").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)

    this.taskService
      .getTasks()
      .subscribe(tasks => {
        console.log(tasks);
        this.tasks = tasks;

        var doneTasks = tasks.filter((t: Task) => t.isDone);


        console.log(tasks);

        main([{
          name: "Done",
          value: doneTasks.length
        },
        {
          name: "Not Done",
          value: tasks.length - doneTasks.length
        }]);

      });



    function cast(d) {
      d.value = +d.value
      return d
    }

    function main(data) {
      setSize(data)
      drawChart(data)
    }

    function setSize(data) {
      width = 300
      height = 300

      margin = { top: 40, left: 0, bottom: 40, right: 0 }


      chartWidth = width - (margin.left + margin.right)
      chartHeight = height - (margin.top + margin.bottom)

      svg.attr("width", width).attr("height", height)


      chartLayer
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("transform", "translate(" + [margin.left, margin.top] + ")")


    }

    function drawChart(data) {
      //pieチャート用のデータセットを生成する
      var arcs = d3.pie()
        .sort(null)
        .value(function (d) { return d.value; })
        (data)


      var arc = d3.arc()
        .outerRadius(chartHeight / 2)
        .innerRadius(chartHeight / 4)
        .padAngle(0.03)
        .cornerRadius(8)

      var pieG = chartLayer.selectAll("g")
        .data([data])
        .enter()
        .append("g")
        .attr("transform", "translate(" + [chartWidth / 2, chartHeight / 2] + ")")

      var block = pieG.selectAll(".arc")
        .data(arcs)

      var newBlock = block.enter().append("g").classed("arc", true)


      newBlock.append("path")
        .attr("d", arc)
        .attr("id", function (d, i) { return "arc-" + i })
        .attr("stroke", "gray")
        .attr("fill", function (d, i) { return d3.interpolateCool(Math.random()) })


      newBlock.append("text")
        .attr("dx", 55)
        .attr("dy", -5)
        .append("textPath")
        .attr("xlink:href", function (d, i) { return "#arc-" + i; })
        .text(function (d) { console.log(d); return d.data.name })
    }
  }

}