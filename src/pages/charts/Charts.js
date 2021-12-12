import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// components
import Widget from "../../components/Widget/Widget";
import ApexLineChart from "./components/ApexLineChart";
import ApexHeatmap from "./components/ApexHeatmap";
import PageTitle from "../../components/PageTitle/PageTitle";
import instance from "../../services";
import { set } from "date-fns";

// const lineChartData = [
//   {
//     name: "Week 1",
//     count: 2000,
//   },
//   {
//     name: "Week 2",
//     count: 1398,
//   },
//   {
//     name: "Week 3",
//     count: 9800,
//   },
//   {
//     name: "Week 4",
//     count: 3908,
//   },
//   {
//     name: "Week 5",
//     count: 4800,
//   },
// ];


const pieChartData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

export default function Charts(props) {
  var theme = useTheme();

  const [lineChartData,setLineChartData
    // {
    //   name: "Week 1",
    //   count: 2000,
    // },
    // {
    //   name: "Week 2",
    //   count: 1398,
    // },
    // {
    //   name: "Week 3",
    //   count: 9800,
    // },
    // {
    //   name: "Week 4",
    //   count: 3908,
    // },
    // {
    //   name: "Week 5",
    //   count: 4800,
    // },
  ] = useState([])
  
  useEffect(() => {
    let url = "/admin/getCountTripByWeek";
    instance.get(url)
      .then(res => {
        //console.log(res);
        if (res?.status === 200) {
          const data = res?.body;
          const lineChartData1 = [];
          data.find((element) => {
            lineChartData1.push({
              name: "Week " + element.week,
              count: element.count
            })
          });
          setLineChartData(lineChartData1);
        }
      })
  }, []);


  // local
  var [activeIndex, setActiveIndexId] = useState(0);

  return (
    <>
      <PageTitle title="Charts Page - Data Display" button={
        <Button
          variant="contained"
          size="medium"
          color="secondary"
        >
          Latest Reports
        </Button>
      } />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
        </Grid>
        <Grid item xs={12} md={6}>
        </Grid>
        <Grid item xs={12} md={8}>
          <Widget title="Chart TripBus for Month" noBodyPadding upperTitle>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                width={500}
                height={300}
                data={lineChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                />
                {/* <Line
                  type="monotone"
                  dataKey="uv"
                  stroke={theme.palette.secondary.main}
                /> */}
              </LineChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>
        <Grid item xs={12} md={4}>
          <Widget title="System management">
            <ResponsiveContainer width="100%" height={300}>
              <img src={"../sm-tickets-logo.jpg"}
                                        variant="outlined"
                                        id="image" 
                                        width="500" height="420" />
            </ResponsiveContainer>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

// ################################################################

function renderActiveShape(props) {
  var RADIAN = Math.PI / 180;
  var {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  var sin = Math.sin(-RADIAN * midAngle);
  var cos = Math.cos(-RADIAN * midAngle);
  var sx = cx + (outerRadius + 10) * cos;
  var sy = cy + (outerRadius + 10) * sin;
  var mx = cx + (outerRadius + 30) * cos;
  var my = cy + (outerRadius + 30) * sin;
  var ex = mx + (cos >= 0 ? 1 : -1) * 22;
  var ey = my;
  var textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
}
