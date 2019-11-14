import { ServiceInputParameters, ServiceOutputParameters } from '..';

export interface IService<TInput extends ServiceInputParameters | undefined, TOutput extends ServiceOutputParameters | undefined> {

    execute(inputParameters: TInput): Promise<TOutput>;

}
