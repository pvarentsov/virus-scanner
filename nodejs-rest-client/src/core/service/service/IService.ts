import { ServiceInputParameters, ServiceOutputParameters } from '..';

type ServiceInput = ServiceInputParameters | undefined;
type ServiceOutput = ServiceOutputParameters | undefined;

export interface IService<TInput extends ServiceInput, TOutput extends ServiceOutput> {

    execute(inputParameters: TInput): Promise<TOutput>;

}
