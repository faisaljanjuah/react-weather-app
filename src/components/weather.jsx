import React from 'react';
import WeatherGraph from './weatherChart';

const Weather = ({ data, lastUpdate, showDetails, details }) => {
    if (!data) return;
    let { city, region, country } = data.location;
    let { pubDate: date, condition, wind, atmosphere, astronomy } = data.current_observation;
    date = (new Date(date)).toString().split(' ');

    let title = city + (region.trim() !== city ? `, ${region}` : '') + ', ' + country;
    return (
        <div className="weatherWrapper">
            {
                details &&
                <div className="modal" style={details ? { display: 'block' } : { display: 'none' }}>
                    <div className="modal-dialog details">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title"><span>More details for:</span> {title}</h4>
                                <button type="button" className="close" onClick={() => showDetails(false)}>&times;</button>
                            </div>
                            <div className="modal-body d-flex">
                                <div className="d-flex flex-column flex-fill">
                                    <div>Humidity: {atmosphere.humidity}</div>
                                    <div>Pressure: {atmosphere.pressure}</div>
                                </div>
                                <div className="d-flex flex-column flex-fill">
                                    <div>Sunrise: {astronomy.sunrise}</div>
                                    <div>Sunset: {astronomy.sunset}</div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => showDetails(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="row d-flex flex-row-reverse">
                <div className="col-md-12 col-lg-4 text-right">
                    <em><strong>Last Updated</strong>: {lastUpdate}</em>
                </div>
                <div className="col-md-12 col-lg-8 text-left">
                    <h1>{title}</h1>
                    <h3>{`${date[0]} ${date[2]}, ${date[1]} `}</h3>
                </div>
            </div>

            <div className="d-flex justify-content-between mt-2">
                <div className="temperature">
                    <h1>Today's Temperature: <strong>{condition.temperature}<sup>o</sup></strong></h1>
                    <h3>Weather Condition: <strong>{condition.text}</strong></h3>
                </div>
                <div className="details d-flex flex-column">
                    <div className="d-flex flex-column flex-fill">
                        <div className="cell text-right"><h3>Wind Direction: <strong>{wind.direction} deg</strong></h3></div>
                        <div className="cell text-right"><h3>Wind Speed: <strong>{wind.speed}m/s</strong></h3></div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-link" onClick={() => showDetails(true)}>Details</button>
                    </div>
                </div>
            </div>

            <div className="graphBox">
                <WeatherGraph data={data.forecasts} title={title} />
            </div>

        </div>
    );
}

export default Weather;