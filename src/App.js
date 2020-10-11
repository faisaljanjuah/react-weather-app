import React, { Component } from 'react';
import Welcome from './components/welcome';
import $ from 'jquery';
import * as CryptoJS from 'crypto-js';
import Weather from './components/weather';


class App extends Component {
  state = {
    welcome: true,
    lastUpdated: '',
    loading: true,
    notExact: '',
    formText: '',
    location: 'Islamabad',
    moreDetails: false,
    details: {
      location: {}
    }
  }

  loadWeatherDetails = (location) => {
    var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
    var method = 'GET';
    var app_id = 'YM49FYuT';
    var consumer_key = 'dj0yJmk9M1ZnNGF4eWdXTkltJmQ9WVdrOVdVMDBPVVpaZFZRbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWZh';
    var consumer_secret = 'be0224c0dd025d04112135aaee93881b9b241e49';
    var concat = '&';
    var query = { 'location': location, 'format': 'json' };
    var oauth = {
      'oauth_consumer_key': consumer_key,
      'oauth_nonce': Math.random().toString(36).substring(2),
      'oauth_signature_method': 'HMAC-SHA1',
      'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
      'oauth_version': '1.0'
    };

    var merged = {};
    $.extend(merged, query, oauth);
    // Note the sorting here is required
    var merged_arr = Object.keys(merged).sort().map(function (k) {
      return [k + '=' + encodeURIComponent(merged[k])];
    });
    var signature_base_str = method
      + concat + encodeURIComponent(url)
      + concat + encodeURIComponent(merged_arr.join(concat));

    var composite_key = encodeURIComponent(consumer_secret) + concat;
    var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
    var signature = hash.toString(CryptoJS.enc.Base64);

    oauth['oauth_signature'] = signature;
    var auth_header = 'OAuth ' + Object.keys(oauth).map(function (k) {
      return [k + '="' + oauth[k] + '"'];
    }).join(',');

    return { authHeader: auth_header, appId: app_id, url: url, query: query };
  }

  componentDidMount() {
    const that = this;
    let { location } = this.state;
    var result = this.loadWeatherDetails(location);
    $.ajax({
      url: result.url + '?' + $.param(result.query),
      headers: {
        'Authorization': result.authHeader,
        'X-Yahoo-App-Id': result.appId
      },
      method: 'GET',
      success: function (data) {
        that.mapAPIResponse(location, data);
      },
      error: function (data) {
        that.mapAPIResponse(location, data);
      },
    });
  }

  closePopup = () => {
    let { welcome } = { ...this.state };
    welcome = false;
    this.setState({ welcome });
  }
  onChangeInput = (e) => {
    let { formText } = this.state;
    formText = e.currentTarget.value;
    this.setState({ formText });
  }

  getWeather = (e) => {
    e.preventDefault();
    const that = this;
    let { loading } = { ...this.state };
    let location = e.currentTarget.city.value
    loading = true;
    this.setState({ loading });
    var result = this.loadWeatherDetails(location);
    $.ajax({
      url: result.url + '?' + $.param(result.query),
      headers: {
        'Authorization': result.authHeader,
        'X-Yahoo-App-Id': result.appId
      },
      method: 'GET',
      success: function (data) {
        that.mapAPIResponse(location, data);
      },
      error: function (data) {
        that.mapAPIResponse(location, data);
      },
    });
  }

  mapAPIResponse = (query, data) => {
    let loading = false;
    let exactLocation = '';
    let notExact = '';
    let lastUpdated = '';
    if (!data.status) {
      exactLocation = (data.location && data.location.city) ? data.location.city : '';
      notExact = query.toLowerCase() === (data.location.city && data.location.city.toLowerCase()) ? '' : query;
      lastUpdated = new Date().toLocaleTimeString();
      this.setState({ notExact, location: exactLocation, details: data, lastUpdated });
    }
    this.setState({ loading });
  }

  render() {
    const { welcome, loading, location, notExact, details, formText, lastUpdated, moreDetails } = this.state;
    return (
      <React.Fragment>
        {loading && <div className="load-bar">
          <div className="bar"></div>
          <div className="bar"></div>
        </div>}
        {welcome && <Welcome close={this.closePopup} />}
        <div className="App container">
          <form onSubmit={this.getWeather} className="searchForm d-flex">
            <input type="text" name="city" placeholder="Search by City Name..." value={formText} onChange={e => this.onChangeInput(e)} />
            <button className="search" type="submit" disabled={!formText}>Search</button>
          </form>
          <div className="weatherReport">
            {(notExact && location) ? <h2>Did you mean {location}?</h2> : null}
            {location ? <h2>Showing weather of <span className="capital">"{location}"</span></h2> : null}
            {
              !loading && Object.keys(details && details.location).length < 1
              && <p>Sorry we found nothing for this location <span className="capital">"{notExact}"</span></p>
            }
            {
              Object.keys(details && details.location).length > 0
                ? <Weather data={details} lastUpdate={lastUpdated} showDetails={e => this.setState({ moreDetails: e })} details={moreDetails} />
                : null
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;