
import { GoogleGenAI } from "@google/genai";
import { UserStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialDiscoveryMessage = async (stats: UserStats): Promise<string> => {
  const accessible = (stats.accessibleMoney.bank1 || 0) + (stats.accessibleMoney.bank2 || 0) + (stats.accessibleMoney.physical || 0);
  const invested = (stats.investments.savings || 0) + (stats.investments.tesouro || 0) + (stats.investments.stocks || 0) + (stats.investments.others || 0);
  const total = accessible + invested;

  const prompt = `
    Você é um coach financeiro empático e motivador do app "PatrimônioPro".
    Sua missão é dar um feedback sobre a primeira "foto financeira" do usuário para eliminar o medo e gerar clareza.

    Dados do Usuário:
    - Patrimônio Total: R$ ${total.toLocaleString('pt-BR')}
    - Dinheiro Acessível (Liquidez): R$ ${accessible.toLocaleString('pt-BR')}
    - Total Investido: R$ ${invested.toLocaleString('pt-BR')}
    
    Regras:
    1. Seja CURTO (máximo 3 frases).
    2. Use um tom de comemoração, nunca de crítica.
    3. Se o investimento for baixo (menos de R$ 1000), foque em "ter uma base sólida para começar".
    4. Se for alto mas disperso, foque na "oportunidade de organizar e potencializar".
    5. Idioma: Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    return response.text?.trim() || "Sua jornada financeira começou oficialmente! Hoje você deu o primeiro passo para a clareza e liberdade.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Excelente começo! Você acaba de transformar incerteza em clareza. Esse é o fundamento de qualquer grande patrimônio.";
  }
};

export const getInvestmentOpportunityAdvice = async (stats: UserStats): Promise<string> => {
  const totalWealth = (stats.accessibleMoney.bank1 || 0) + (stats.accessibleMoney.bank2 || 0) + (stats.accessibleMoney.physical || 0) +
                      (stats.investments.savings || 0) + (stats.investments.tesouro || 0) + (stats.investments.stocks || 0) + (stats.investments.others || 0);
  
  const prompt = `
    Você é a Inteligência Artificial do PatrimônioPro. Analise a situação financeira e dê uma recomendação de alocação de ativos personalizada.
    
    Situação Atual:
    - Patrimônio Total: R$ ${totalWealth.toLocaleString('pt-BR')}
    - Liquidez (Bancos/Dinheiro): R$ ${(stats.accessibleMoney.bank1 + stats.accessibleMoney.bank2 + stats.accessibleMoney.physical).toLocaleString('pt-BR')}
    - Investimentos Atuais: R$ ${(stats.investments.savings + stats.investments.tesouro + stats.investments.stocks + stats.investments.others).toLocaleString('pt-BR')}
    
    Tarefa:
    Gere uma recomendação técnica porém simples de alocação para o capital disponível (ex: 70% em Tesouro Selic para reserva e 30% em FIIs para renda). 
    Foque em como otimizar o que ele já tem. Seja direto e use no máximo 150 caracteres.
    Não use introduções, vá direto ao ponto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    
    return response.text?.trim() || "Considere alocar 80% em Tesouro Selic para segurança e 20% em FIIs para renda mensal isenta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sugerimos manter 70% em ativos de liquidez diária e 30% em dividendos para equilibrar risco e retorno.";
  }
};

export const getChallengeFeedback = async (choice: string, amount: number): Promise<string> => {
  const prompt = `
    Contexto: O usuário está em um desafio de investimento no app "PatrimônioPro".
    Cenário: Ele recebeu R$ ${amount.toLocaleString('pt-BR')} extras e escolheu investir em: "${choice}".
    
    Tarefa: Explique em 2 frases POR QUE essa escolha é interessante ou quais cuidados ele deve ter, focando em EDUCAÇÃO FINANCEIRA.
    Seja motivador e direto. Use tom amigável.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text?.trim() || "Boa escolha! Diversificar é a chave para proteger seu capital enquanto busca rentabilidade.";
  } catch {
    return "Excelente decisão! Alocar recursos com estratégia é o que separa poupadores de investidores de sucesso.";
  }
};
