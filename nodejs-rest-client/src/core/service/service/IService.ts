import { ServiceInputParameters } from '..';

export interface IService {

    execute<TInput extends ServiceInputParameters, TOutput>(inputParameters: TInput): Promise<TOutput>;

}
