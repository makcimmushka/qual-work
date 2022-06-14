import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { CreateRequestDto, UpdateRequestDto } from '../../domain/interface';
import { ExceptionFilter } from '../../common/exception-filter';
import { LoggerService } from '../../common/logger';
import { RequestService } from './request.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionFilter())
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(RequestController.name);
  }

  @MessagePattern('request.get')
  public getRequest(@Payload() message: Record<string, any>): Observable<any> {
    const requestId: string = message.value.requestId;
    return from(this.requestService.getRequest(requestId));
  }

  @MessagePattern('requests.get')
  public getAllRequests(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    return from(this.requestService.getAllRequests());
  }

  @MessagePattern('request.finish')
  public finishRequest(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    const requestId: string = message.value.requestId;
    return from(this.requestService.finishRequest(requestId));
  }

  @MessagePattern('request.assign')
  public assignRequest(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    const { requestId, volunteerId } = message.value;
    return from(this.requestService.assignRequest({ requestId, volunteerId }));
  }

  @MessagePattern('request.unassign')
  public unassignRequest(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    const { requestId, volunteerId } = message.value;
    return from(
      this.requestService.unassignRequest({ requestId, volunteerId }),
    );
  }

  @MessagePattern('request.create')
  public createRequest(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    const createRequestDto: CreateRequestDto = message.value;
    return from(this.requestService.createRequest(createRequestDto));
  }

  @MessagePattern('request.update')
  public updateRequest(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    const updateRequestDto: UpdateRequestDto = message.value;
    return from(this.requestService.updateRequest(updateRequestDto));
  }

  @MessagePattern('request.delete')
  public deleteRequest(
    @Payload() message: Record<string, any>,
  ): Observable<any> {
    const requestId: string = message.value.requestId;
    return from(this.requestService.deleteRequest(requestId));
  }
}
