import React from 'react';

export default class Lamp extends React.Component {
  constructor(props) {
      super(props);

      this.state = { data: this.props.data, connected: false, cbConnected: this.props.callbackConnected, fillColor: "#000000" }
      
      this.resolveThingDescription = this.resolveThingDescription.bind(this);
  }

  componentDidMount() {
      this.interval = setInterval(this.resolveThingDescription, 1000);
  }

  componentWillUnmount() {
      clearInterval(this.interval);
  }

  async resolveThingDescription() {
      var resp = await fetch(this.state.data.details.stateURL);
      var newState = this.state;

      if (resp.status === 200) {
        this.state.cbConnected(true);
        var jsonResp = await resp.json();
        
        if (jsonResp[this.state.data.details.stateProperty]) {
          newState.fillColor = "#FF6E04";
        } else {
          newState.fillColor = "#000000";
        }

        this.setState(newState);
      }
      else {
        this.state.cbConnected(false);  
      }
  }

  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
        width={this.props.width} height={this.props.height}
        x={this.props.x} y={this.props.y} fill={this.state.fillColor}
        viewBox="0 0 390 390" pointerEvents="bounding-box">
          <title>{this.props.data.details.name} {this.props.data.id}</title>
          <path id="Auswahl" d="M 190.00,0.42
                  C 190.00,0.42 177.00,1.17 177.00,1.17
                    162.44,2.56 147.93,5.60 134.00,10.03
                    87.96,24.67 49.32,57.26 25.43,99.00
                    11.94,122.57 3.74,150.01 1.04,177.00
                    1.04,177.00 1.04,186.00 1.04,186.00
                    1.04,186.00 0.03,195.00 0.03,195.00
                    0.03,195.00 0.91,204.00 0.91,204.00
                    1.63,214.54 2.35,224.57 4.45,235.00
                    11.71,271.12 31.01,306.94 57.04,332.96
                    83.06,358.99 118.88,378.29 155.00,385.55
                    165.43,387.65 175.46,388.37 186.00,389.09
                    186.00,389.09 195.00,389.97 195.00,389.97
                    195.00,389.97 222.00,387.72 222.00,387.72
                    314.53,375.25 384.98,298.15 389.04,205.00
                    389.04,205.00 389.97,195.00 389.97,195.00
                    389.97,195.00 389.04,185.00 389.04,185.00
                    385.45,102.63 329.48,31.12 250.00,8.29
                    234.77,3.92 220.80,1.65 205.00,0.96
                    198.00,0.66 198.44,-0.60 190.00,0.42 Z
                  M 178.00,30.14
                  C 178.00,30.14 194.00,30.14 194.00,30.14
                    213.49,30.00 226.13,31.18 245.00,37.02
                    261.50,42.14 279.17,51.05 293.00,61.37
                    325.15,85.37 346.40,117.03 355.87,156.00
                    357.71,163.56 359.91,175.33 360.00,183.00
                    360.28,207.10 360.28,221.43 352.98,245.00
                    346.86,264.73 337.34,281.63 324.87,298.00
                    311.87,315.06 292.84,330.48 274.00,340.69
                    254.93,351.03 226.79,359.97 205.00,360.00
                    205.00,360.00 183.00,360.00 183.00,360.00
                    174.50,359.90 162.34,357.45 154.00,355.37
                    99.96,341.92 57.32,302.35 38.69,250.00
                    30.06,225.74 29.96,210.00 30.00,185.00
                    30.02,174.93 32.19,163.78 34.63,154.00
                    45.78,109.19 75.41,71.31 116.00,49.31
                    136.98,37.94 154.70,33.65 178.00,30.14 Z
                  M 194.00,120.59
                  C 194.00,120.59 183.00,121.44 183.00,121.44
                    159.70,125.09 138.97,139.81 128.37,161.00
                    103.71,210.29 139.60,271.47 196.00,269.41
                    207.76,268.98 218.38,266.95 229.00,261.63
                    273.60,239.32 282.82,178.69 248.91,143.01
                    234.44,127.79 214.64,120.76 194.00,120.59 Z
                  M 188.00,150.00
                  C 188.00,150.00 188.00,188.00 188.00,188.00
                    188.00,188.00 150.00,188.00 150.00,188.00
                    154.33,166.55 166.55,154.33 188.00,150.00 Z
                  M 240.00,188.00
                  C 240.00,188.00 202.00,188.00 202.00,188.00
                    202.00,188.00 202.00,150.00 202.00,150.00
                    223.45,154.33 235.67,166.55 240.00,188.00 Z
                  M 188.00,202.00
                  C 188.00,202.00 188.00,240.00 188.00,240.00
                    166.55,235.67 154.33,223.45 150.00,202.00
                    150.00,202.00 188.00,202.00 188.00,202.00 Z
                  M 240.00,202.00
                  C 235.67,223.45 223.45,235.67 202.00,240.00
                    202.00,240.00 202.00,202.00 202.00,202.00
                    202.00,202.00 240.00,202.00 240.00,202.00 Z" />
        </svg>
    );
  }
}
