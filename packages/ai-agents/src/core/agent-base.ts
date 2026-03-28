import { LanguageModelV1 } from 'ai';

export interface AgentConfig {
  model: any;
  systemPrompt: string;
}

export abstract class BaseAgent<TInput, TOutput> {
  protected model: any;
  protected systemPrompt: string;

  constructor(config: AgentConfig) {
    this.model = config.model;
    this.systemPrompt = config.systemPrompt;
  }

  // Each specific agent must implement this
  abstract execute(input: TInput): Promise<TOutput>;
}
