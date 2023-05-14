let Plotly = false;

  function arrDepth(arr) {
    if (arr[0].length === undefined)        return 1;
    if (arr[0][0].length === undefined)     return 2;
    if (arr[0][0][0].length === undefined)  return 3;
  } 

  function transpose(matrix) {
    let newm = structuredClone(matrix);
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < i; j++) {
   
        newm[i][j] = matrix[j][i];
        newm[j][i] = matrix[i][j];
      }
    } 
    return newm;
  } 
 
  core.ListPlotly = async function(args, env) {
      if (!Plotly) Plotly = await import('./plotly.min-72d97100.js').then(function (n) { return n.p; });
 
      env.numerical = true;
      let arr = await interpretate(args[0], env);
      let newarr = [];

      let options = {};
      if (args.length > 1) options = core._getRules(args, env);

      console.log('options');
      console.log(options);

      switch(arrDepth(arr)) {
        case 1:
          newarr.push({y: arr, mode: 'markers'});
        break;
        case 2:
          if (arr[0].length === 2) {
            console.log('1 XY plot');
            let t = transpose(arr);
      
            newarr.push({x: t[0], y: t[1], mode: 'markers'});
          } else {
            console.log('multiple Y plot');
            arr.forEach(element => {
              newarr.push({y: element, mode: 'markers'}); 
            });
          }
        break;
        case 3:
          arr.forEach(element => {
            let t = transpose(element);
            newarr.push({x: t[0], y: t[1], mode: 'markers'}); 
          });
        break;      
      }

      Plotly.newPlot(env.element, newarr, {autosize: false, width: core.DefaultWidth, height: core.DefaultWidth*0.618034, margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 30,
          pad: 4
        }});
      
      if (!('RequestAnimationFrame' in options)) return;
      
          console.log('request animation frame mode');
          const list = options.RequestAnimationFrame;
          const event = list[0];
          const symbol = list[1];
          const depth = arrDepth(arr);
          
          const request = function() {
            core.FireEvent(["'"+event+"'", 0]);
          };

          const renderer = function(args2, env2) {
            let arr2 = interpretate(args2[0], env2);
            let newarr2 = [];
      
            switch(depth) {
              case 1:
                newarr2.push({y: arr2});
              break;
              case 2:
                if (arr2[0].length === 2) {
                 
                  let t = transpose(arr2);
            
                  newarr2.push({x: t[0], y: t[1]});
                } else {
         
                  arr2.forEach(element => {
                    newarr2.push({y: element}); 
                  });
                }
              break;
              case 3:
                arr2.forEach(element => {
   
                   let newEl = transpose(element);
                  newarr2.push({x: newEl[0], y: newEl[1]}); 
                });
              break;      
            }

            Plotly.animate(env.element, {
              data: newarr2
            }, {
              transition: {
                duration: 30
              },
              frame: {
                duration: 0,
                redraw: false
              }
            });

            requestAnimationFrame(request);
          }; 

          core[symbol] = renderer;
          request();
    };

    core.ListPlotly.destroy = ()=>{};
    
    core.ListLinePlotly = async function(args, env) {
      if (!Plotly) Plotly = await import('./plotly.min-72d97100.js').then(function (n) { return n.p; });
      console.log('listlineplot: getting the data...');
      env.numerical = true;
      let arr = await interpretate(args[0], env);
      console.log('listlineplot: got the data...');
      console.log(arr);
      let newarr = [];

      let options = core._getRules(args, env);
      /**
       * @type {[Number, Number]}
       */
      let ImageSize = options.ImageSize || [core.DefaultWidth, 0.618034*core.DefaultWidth];
  
      const aspectratio = options.AspectRatio || 0.618034;
  
      //if only the width is specified
      if (!(ImageSize instanceof Array)) ImageSize = [ImageSize, ImageSize*aspectratio];
  
      console.log('Image size');
      console.log(ImageSize);         

      switch(arrDepth(arr)) {
        case 1:
          newarr.push({y: arr});
        break;
        case 2:
          if (arr[0].length === 2) {
            console.log('1 XY plot');
            let t = transpose(arr);
            console.log(t);
      
            newarr.push({x: t[0], y: t[1]});
          } else {
            console.log('multiple Y plot');
            arr.forEach(element => {
              newarr.push({y: element}); 
            });
          }
        break;
        case 3:
          arr.forEach(element => {
             
             let newEl = transpose(element);
            newarr.push({x: newEl[0], y: newEl[1]}); 
          });
        break;      
      }

      Plotly.newPlot(env.element, newarr, {autosize: false, width: ImageSize[0], height: ImageSize[1], margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 30,
          pad: 4
        }});  
    };   

    core.ListLinePlotly.update = async (args, env) => {
      env.numerical = true;
      console.log('listlineplot: update: ');
      console.log(args);
      console.log('interpretate!');
      let arr = await interpretate(args[0], env);
      console.log(arr);    

      let newarr = [];

      switch(arrDepth(arr)) {
        case 1:
          newarr.push({y: arr});
        break;
        case 2:
          if (arr[0].length === 2) {
            console.log('1 XY plot');
            let t = transpose(arr);
      
            newarr.push({x: t[0], y: t[1]});
          } else {
            console.log('multiple Y plot');
            arr.forEach(element => {
              newarr.push({y: element}); 
            });
          }
        break;
        case 3:
          arr.forEach(element => {
            let newEl = transpose(element);
            
            newarr.push({x: newEl[0], y: newEl[1]}); 
          });
        break;      
      }

      console.log("plotly with a new data: ");
      console.log(newarr);
      console.log("env");
      console.log(env);

      Plotly.animate(env.element, {
        data: newarr,
      }, {
        transition: {
          duration: 300,
          easing: 'cubic-in-out'
        },
        frame: {
          duration: 300
        }
      });     
    };
    
    core.ListLinePlotly.destroy = ()=>{};



  let d3 = false;

  let g2d = {};
  g2d.name = "WebObjects/Graphics";

  interpretate.contextExpand(g2d);

  g2d.Graphics = async (args, env) => {
    if (!d3) d3 = await import('./index-3c8541b8.js');

    /**
     * @type {Object}
     */  
    let options = core._getRules(args, {...env, context: g2d, hold:true});
    

    if (Object.keys(options).length == 0 && args.length > 1) 
      options = core._getRules(interpretate(args[1], {...env, hold:true}), {...env, context: g2d, hold:true});

    console.log(options);

    /**
     * @type {HTMLElement}
     */
    var container = env.element;

    /**
     * @type {[Number, Number]}
     */
    let ImageSize = interpretate(options.ImageSize, env) || [core.DefaultWidth, 0.618034*core.DefaultWidth];

    const aspectratio = interpretate(options.AspectRatio, env) || 0.618034;

    //if only the width is specified
    if (!(ImageSize instanceof Array)) ImageSize = [ImageSize, ImageSize*aspectratio];

    console.log('Image size');
    console.log(ImageSize); 

    let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = ImageSize[0] - margin.left - margin.right,
    height = ImageSize[1] - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select(container)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    let range = [[-1,1],[-1,1]];

    if (options.PlotRange) {
      range = interpretate(options.PlotRange, env);
    }

    let axis = [false, false];

    //simplified version
    if (options.Axes) {
      options.Axes = interpretate(options.Axes, env);

      if (options.Axes === true) {
        axis = [true, true];
      } else if (Array.isArray(options.Axes)) {
        axis = options.Axes;
      }
    }

    console.log(range);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
      .domain(range[0])
      .range([ 0, width ]);
    
    if (axis[0]) svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain(range[1])
      .range([ height, 0 ]);
    
    if (axis[1]) svg.append("g").call(d3.axisLeft(y)).call(d3.axisLeft(y));   

      const envcopy = {
        ...env,
        context: g2d,
        svg: svg,
        xAxis: x,
        yAxis: y,
        numerical: true,
        tostring: false,
        color: 'black',
        opacity: 1,
        strokeWidth: 1.5,
        pointSize: 0.013,
        fill: 'none',
        transition: {duration: 300}
      }; 
      
      if (options.TransitionDuration) {
        envcopy.transition.duration = interpretate(options.TransitionDuration, env);
      }

      envcopy.local.xAxis = x;
      envcopy.local.yAxis = y;

      interpretate(options.Epilog, envcopy);
      interpretate(args[0], envcopy);
      interpretate(options.Prolog, envcopy);
  };

  g2d.Graphics.update = (args, env) => {};
  g2d.Graphics.destroy = (args, env) => {};

  g2d.AbsoluteThickness = (args, env) => {
    env.strokeWidth = interpretate(args[0], env);
  };

  g2d.PointSize = (args, env) => {
    env.pointSize = interpretate(args[0], env);
  };

  g2d.Annotation = core.List;

  g2d.Directive = (args, env) => {
    args.forEach((el) => {
      interpretate(el, env);
    });
  };

  g2d.Opacity = (args, env) => {
    env.opacity = interpretate(args[0], env);
  };

  g2d.RGBColor = (args, env) => {
    if (args.length == 3) {
      const color = args.map(el => 255*interpretate(el, env));
      env.color = "rgb("+color[0]+","+color[1]+","+color[2]+")";
    } else {
      console.error('g2d: RGBColor must have three arguments!');
    }
  };

  g2d.Hue = (args, env) => {
    if (args.length == 3) {
      const color = args.map(el => 100*interpretate(el, env));
      env.color = "hls("+(3.59*color[0])+","+color[1]+","+color[2]+")";
    } else {
      console.error('g2d: Hue must have three arguments!');
    }
  };  


  g2d.Line = async (args, env) => {
    console.log('drawing a line');
    let data = await interpretate(args[0], env);
    const x = env.xAxis;
    const y = env.yAxis;

    const uid = uuidv4();
    env.local.uid = uid;

    env.local.uid = uid;



    switch(arrDepth(data)) {
      case 2:
        env.svg.append("path")
        .datum(data)
        .attr("class", 'line-'+uid)
        .attr("fill", "none")
        .attr("stroke", env.color)
        .attr("stroke-width", env.strokeWidth)
        .attr("d", d3.line()
          .x(function(d) { return x(d[0]) })
          .y(function(d) { return y(d[1]) })
          );    
      break;
    
      case 3:
        env.local.nsets = data.length;

        data.forEach((d, i)=>{
          env.svg.append("path")
          .datum(d)
          .attr("class", 'line-'+uid+i)
          .attr("fill", "none")
          .attr("stroke", env.color)
          .attr("stroke-width", env.strokeWidth)
          .attr("d", d3.line()
            .x(function(d) { return x(d[0]) })
            .y(function(d) { return y(d[1]) })
            );
        });    
      break;
    } 

    env.local.line = d3.line()
        .x(function(d) { return env.xAxis(d[0]) })
        .y(function(d) { return env.yAxis(d[1]) });
  };

  g2d.Line.update = async (args, env) => {
    let data = await interpretate(args[0], env);
    const x = env.xAxis;
    const y = env.yAxis;


    switch(arrDepth(data)) {
      case 2:
        env.svg.selectAll('.line-'+env.local.uid)
        .datum(data)
        .join("path")
        .attr("class",'line-'+env.local.uid)
        .transition()
        .duration(env.transition.duration)
        .attr("d", env.local.line);   
      break;
    
      case 3:
        for (let i=0; i < Math.min(data.length, env.local.nsets); ++i) {
          env.svg.selectAll('.line-'+env.local.uid+i).datum(data[i])
          .join("path")
          .attr("class",'line-'+env.local.uid+i)
          .transition()
          .duration(env.transition.duration)
          .attr("d", env.local.line);
        }
        if (data.length > env.local.nsets) {
          for (let i=env.local.nsets; i < data.length; ++i) {
            env.svg.append("path")
            .datum(data[i])
            .attr("class", 'line-'+env.local.uid+i)
            .attr("fill", "none")
            .attr("stroke", env.color)
            .attr("stroke-width", env.strokeWidth)
            .transition()
            .duration(env.transition.duration)            
            .attr("d", d3.line()
              .x(function(d) { return x(d[0]) })
              .y(function(d) { return y(d[1]) })
              );          
          }
        }

        if (data.length < env.local.nsets) {
          for (let i=data.length; i < env.local.nsets; ++i) {
            env.svg.selectAll('.line-'+env.local.uid+i).datum(data[0])
            .join("path")
            .attr("class",'line-'+env.local.uid+i)
            .transition()
            .duration(env.transition.duration)
            .attr("d", env.local.line);            
          }
        }

        env.local.nsets = Math.max(data.length, env.local.nsets);
      break;
    }    


  };

  g2d.Line.virtual = true;

  g2d.Point = async (args, env) => {
    let data = await interpretate(args[0], env);
    const x = env.xAxis;
    const y = env.yAxis;

    if (arrDepth(data) < 2) {
      data = [data];
    }

    const uid = uuidv4();
    env.local.uid = uid;
    env.local.npoints = data.length;

    

    const object = env.svg.append('g')
    .selectAll()
    .data(data)
    .enter()
    .append("circle")
    .attr('class', "dot-"+uid)
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", env.pointSize*100)
      .style("fill", env.color);
    
    if ('events' in env) {
      //add events liteners
      
      env.events.forEach((e) => {
        console.log(e);
        object.call(e);
      });
    }
  }; 

  g2d.Point.update = async (args, env) => {
    let data = await interpretate(args[0], env);

  
    const x = env.xAxis;
    const y = env.yAxis;

    //mb better not to use selector, but give a direct reference
    const u = env.svg.selectAll('.dot-'+env.local.uid).data(data);

    if (data.length > env.local.npoints) {

      u.enter()
      .append("circle") // Add a new circle for each new elements
      .attr('class', "dot-"+env.local.uid)
      .merge(u).transition()
      .duration(env.transition.duration)
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", env.pointSize*100)
      .style("fill", env.color);

    } else if (data.length < env.local.npoints) {

      u.transition()
      .duration(env.transition.duration)
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", env.pointSize*100)
      .style("fill", env.color);

      //remove the rest
      u.exit()
      .transition() // and apply changes to all of them
      .duration(env.transition.duration)
      .style("opacity", 0)
      .remove();

    } else {

      u.transition()
      .duration(env.transition.duration)
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", env.pointSize*100)
      .style("fill", env.color);

    }

    
    
    
    env.local.npoints = data.length;


  };

  g2d.Point.virtual = true;  

  g2d.EventListener = (args, env) => {
    const options = core._getRules(args, env);

    const envcopy = {
      ...env,
      events: []
    };

    Object.keys(options).forEach((rule)=>{
      envcopy.events.push(g2d.EventListener[rule](options[rule], env));
    });

    return interpretate(args[0], envcopy);
  };

  g2d.EventListener.drag = (uid, env) => {

    console.log('drag event generator');
    console.log(env.local);
    const xAxis = env.local.xAxis;
    const yAxis = env.local.yAxis;

    function dragstarted(event, d) {
      d3.select(this).raise().attr("stroke", "black");
    }
  
    function dragged(event, d) {
      d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
      server.emitt(uid, `{${xAxis.invert(event.x)}, ${yAxis.invert(event.y)}}`);
    }
  
    function dragended(event, d) {
      d3.select(this).attr("stroke", null);
    }
  
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  };

  g2d.EventListener.zoom = (uid, env) => {

    console.log('zoom event generator');
    console.log(env.local);

    function zoom(e) {
      console.log();
      server.emitt(uid, `${e.transform.k}`);
    }
  
    return d3.zoom()
        .on("zoom", zoom);
  };  

  //plugs
  g2d.Void = (args, env) => {};

  g2d.Identity              = g2d.Void;
  g2d.Automatic             = g2d.Void;
  g2d.Scaled                = g2d.Void;
  g2d.GoldenRatio           = g2d.Void;
  g2d.None                  = g2d.Void;
  g2d.GrayLevel             = g2d.Void;
  g2d.AbsolutePointSize     = g2d.Void;
  g2d.CopiedValueFunction   = g2d.Void;
