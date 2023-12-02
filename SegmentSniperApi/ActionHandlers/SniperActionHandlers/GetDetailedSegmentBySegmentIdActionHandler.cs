﻿using AutoMapper;
using SegmentSniper.Data;
using SegmentSniper.Models.Models.Strava.Segment;
using SegmentSniper.Models.UIModels.Segment;
using StravaApiClient;
using StravaApiClient.Models.Segment;
using StravaApiClient.Services.Segment;

namespace SegmentSniper.Api.ActionHandlers.SniperActionHandlers
{
    public class GetDetailedSegmentBySegmentIdActionHandler : IGetDetailedSegmentBySegmentIdActionHandler
    {
        private readonly ISegmentSniperDbContext _context;
        private readonly IStravaRequestService _stravaRequestService;
        private readonly IMapper _mapper;


        public GetDetailedSegmentBySegmentIdActionHandler(ISegmentSniperDbContext context, IStravaRequestService stravaRequestService, IMapper mapper)
        {
            _context = context;
            _stravaRequestService = stravaRequestService;
            _mapper = mapper;
        }

        public async Task<GetDetailedSegmentBySegmentIdRequest.Response> HandleAsync(GetDetailedSegmentBySegmentIdRequest request)
        {
            ValidateRequest(request);
            var token = _context.StravaToken.Where(t => t.UserId == request.UserId).FirstOrDefault();
            if (token != null)
            {
                try
                {
                    _stravaRequestService.UserId = request.UserId;
                    _stravaRequestService.RefreshToken = token.RefreshToken;

                    var response = await _stravaRequestService.GetDetailedSegmentById(new GetDetailedSegmentByIdContract(request.SegmentId));

                    DetailedSegment segment = _mapper.Map<DetailedSegmentApiModel, DetailedSegment>(response.DetailedSegmentApiModel);


                    DetailedSegmentUIModel segmentUiModel = _mapper.Map<DetailedSegment, DetailedSegmentUIModel>(segment);

                    List<DetailedSegmentUIModel> returnList = new List<DetailedSegmentUIModel> { segmentUiModel };

                    return new GetDetailedSegmentBySegmentIdRequest.Response
                    {
                        DetailedSegmentUIModel = returnList
                    };
                }

                catch (Exception ex)
                {
                    //do something different here instead of throwing the exception. log it and return null?
                    throw new ApplicationException("Something went wrong handling the request.", ex);
                }
            }
            else
            {
                throw new ApplicationException("Something went wrong 'handling the request");
            }
        }

        private void ValidateRequest(GetDetailedSegmentBySegmentIdRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (string.IsNullOrWhiteSpace(request.SegmentId))
            {
                throw new ArgumentException(nameof(request.SegmentId), "Segment Id cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(request.UserId))
            {
                throw new ArgumentException(nameof(request.UserId), "Segment Id cannot be empty");
            }
        }

    }
}
