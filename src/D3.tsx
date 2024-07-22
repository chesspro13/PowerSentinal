import * as d3 from "d3";

function D3({
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 20,
    marginLeft = 20,
}) {
    const x = d3.scaleLinear(
        [0, data.length - 1],
        [marginLeft, width - marginRight]
    );
    let y = null;
    d3.extent(data).map((min, max) => {
        y = d3.scaleLinear([min, max], [height - marginBottom, marginTop]);
    });
    const line = d3.line((d, i) => x(i), y);
    return (
        <svg width={width} height={height}>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                d={line(data)}
            />
            <g fill="white" stroke="currentColor" strokeWidth="1.5">
                {data.map((d, i) => (
                    <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
                ))}
            </g>
        </svg>
    );
}

export default D3;
