
import { GoogleGenAI } from "@google/genai";
import { UserStats } from "../types";

// Helper to get an updated AI instance
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialDiscoveryMessage = async (stats: UserStats): Promise<string> => {
  const ai = getAi();
  const accessible = (stats.accessibleMoney.bank1 || 0) + (stats.accessibleMoney.bank2 || 0) + (stats.accessibleMoney.physical || 0);
  const invested = (stats.investments.savings || 0) + (stats.investments.tesouro || 0) + (stats.investments.stocks || 0) + (stats.investments.others || 0);
  const total = accessible + invested;

  const prompt = `
    Você é um coach financeiro de elite do app "PatrimônioPro".
    Sua missão é dar um feedback de alto nível sobre a primeira "foto financeira" do usuário.

    Dados:
    - Patrimônio Total: R$ ${total.toLocaleString('pt-BR')}
    - Liquidez: R$ ${accessible.toLocaleString('pt-BR')}
    - Investido: R$ ${invested.toLocaleString('pt-BR')}
    
    Diretrizes:
    1. Seja conciso (máximo 3 frases).
    2. Tom profissional, inspirador e visionário.
    3. Fale sobre a clareza como o primeiro degrau para a liberdade.
    4. Idioma: Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    
    return response.text?.trim() || "A clareza é o fundamento da riqueza. Você acaba de transformar a névoa da incerteza em um mapa estratégico para o seu futuro.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Excelente começo! Mapear seus recursos é o ato de coragem que separa os sonhadores dos realizadores de patrimônio.";
  }
};

export const getInvestmentOpportunityAdvice = async (stats: UserStats): Promise<string> => {
  const ai = getAi();
  const totalWealth = (stats.accessibleMoney.bank1 || 0) + (stats.accessibleMoney.bank2 || 0) + (stats.accessibleMoney.physical || 0) +
                      (stats.investments.savings || 0) + (stats.investments.tesouro || 0) + (stats.investments.stocks || 0) + (stats.investments.others || 0);
  
  const prompt = `
    Analise como Inteligência Artificial Sênior. Forneça uma recomendação técnica rápida de alocação.
    
    Cenário:
    - Patrimônio: R$ ${totalWealth.toLocaleString('pt-BR')}
    - Liquidez: R$ ${(stats.accessibleMoney.bank1 + stats.accessibleMoney.bank2 + stats.accessibleMoney.physical).toLocaleString('pt-BR')}
    - Investido: R$ ${(stats.investments.savings + stats.investments.tesouro + stats.investments.stocks + stats.investments.others).toLocaleString('pt-BR')}
    
    Recomende uma alocação otimizada em 150 caracteres. Seja direto e técnico.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    
    return response.text?.trim() || "Priorize 6 meses de reserva em Selic; excedente em FIIs e Ações de Valor para fluxo de caixa constante.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sugerimos manter 70% em ativos de liquidez diária e 30% em ativos geradores de renda passiva.";
  }
};

export const getChallengeFeedback = async (choice: string, amount: number): Promise<string> => {
  const ai = getAi();
  const prompt = `
    Usuário investiu R$ ${amount.toLocaleString('pt-BR')} em: "${choice}".
    Explique o impacto técnico dessa decisão em 2 frases curtas e motivadoras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt
    });
    return response.text?.trim() || "Decisão estratégica. Alocar recursos extras com foco em ativos produtivos acelera o efeito dos juros compostos.";
  } catch {
    return "Excelente decisão! Disciplina na alocação de aportes extraordinários é o que constrói grandes fortunas no longo prazo.";
  }
};
