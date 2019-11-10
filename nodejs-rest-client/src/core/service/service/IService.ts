import { ServiceInputParameters, ServiceOutputParameters } from '..';

export interface IService {

    execute<TInput extends ServiceInputParameters, TOutput extends ServiceOutputParameters>(inputParameters: TInput): Promise<TOutput>;

}
