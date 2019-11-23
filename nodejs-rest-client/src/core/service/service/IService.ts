import { ServiceInputParameters, ServiceOutputParameters } from '..';

type ServiceInput = ServiceInputParameters | void;
type ServiceOutput = ServiceOutputParameters | void;

export interface IService<TInput extends ServiceInput, TOutput extends ServiceOutput> {

    execute(inputParameters?: TInput): Promise<TOutput>;

}
