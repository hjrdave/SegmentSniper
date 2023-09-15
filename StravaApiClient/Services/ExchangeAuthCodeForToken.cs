﻿using SegmentSniper.Models.Models.Strava.Token;
using StravaApiClient.Configuration;
using static StravaApiClient.Services.IExchangeAuthCodeForToken;

namespace StravaApiClient.Services
{
    public class ExchangeAuthCodeForToken : IExchangeAuthCodeForToken
    {
        private readonly IStravaRequestClient _stravaRequestClient;
        private readonly IStravaRequestClientConfiguration _config;

        public ExchangeAuthCodeForToken(IStravaRequestClient stravaRequestClient, IStravaRequestClientConfiguration config)
        {
            _stravaRequestClient = stravaRequestClient;
            _config = config;
        }

        public async Task<ExchangeAuthCodeForTokenContract.Result> ExecuteAsync(ExchangeAuthCodeForTokenContract contract)
        {
        //https://www.strava.com/oauth/token?client_id=93654&client_secret=a12792779218b6218e81f7a39e66776314e7f59b&code=ac351fe304418bd91e5df797a3390483094ebfb9&grant_type=authorization_code


            var url = $"{_config.OauthBaseUrl}?client_id={_config.ClientId}&client_secret={_config.ClientSecret}&code={contract.AuthCode}&grant_type=authorization_code";
            var apiResponse = await _stravaRequestClient.GetAsync<ExchangeAuthCodeForTokenContract.Result>(url);



            return new ExchangeAuthCodeForTokenContract.Result(new StravaApiTokenModel());
        }

        public void ValidateContract(ExchangeAuthCodeForTokenContract contract)
        {

        }
    }
}
