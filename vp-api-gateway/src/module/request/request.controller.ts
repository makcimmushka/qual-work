import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../../domain/enum';
import { Roles } from '../../common/decorator';
import { AuthGuard } from '../../common/guard';
import { RequestService } from './request.service';
import {
  AssignRequestDto,
  CreateRequestDto,
  FinishRequestDto,
  UpdateRequestDto,
} from '../../domain/dto/request';

@Controller()
@UseGuards(AuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('request')
  @Roles(Role.Admin, Role.User, Role.Volunteer)
  public getRequest(
    @Query('requestId', ParseUUIDPipe) requestId: string,
  ): Observable<any> {
    return this.requestService.getRequest(requestId);
  }

  @Get('requests')
  @Roles(Role.Admin, Role.User, Role.Volunteer)
  public getRequests(): Observable<any> {
    return this.requestService.getRequests();
  }

  @Post('request')
  @Roles(Role.User, Role.Admin)
  public createRequest(
    @Body() createRequestDto: CreateRequestDto,
  ): Observable<any> {
    return this.requestService.createRequest(createRequestDto);
  }

  @Post('finish-request')
  @Roles(Role.Volunteer, Role.Admin)
  public finishRequest(
    @Body() finishRequestDto: FinishRequestDto,
  ): Observable<any> {
    return this.requestService.finishRequest(finishRequestDto.requestId);
  }

  @Post('assign-request')
  @Roles(Role.Volunteer, Role.Admin)
  public assignRequest(
    @Body() assignRequestDto: AssignRequestDto,
  ): Observable<any> {
    return this.requestService.assignRequest(assignRequestDto);
  }

  @Post('unassign-request')
  @Roles(Role.Volunteer, Role.Admin)
  public unassignRequest(
    @Body() unassignRequestDto: AssignRequestDto, // same dto-s
  ): Observable<any> {
    return this.requestService.unassignRequest(unassignRequestDto);
  }

  @Put('request')
  @Roles(Role.Admin, Role.User)
  public updateRequest(
    @Body() updateRequestDto: UpdateRequestDto,
  ): Observable<any> {
    return this.requestService.updateRequest(updateRequestDto);
  }

  @Delete('request')
  @Roles(Role.Admin, Role.User)
  public deleteRequest(
    @Query('requestId', ParseUUIDPipe) requestId: string,
  ): Observable<any> {
    return this.requestService.deleteRequest(requestId);
  }
}
