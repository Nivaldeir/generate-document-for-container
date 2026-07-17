# Design System — Mutual Pay

Documentação extraída da tela de Dashboard. Use como referência para manter consistência visual em novas telas e componentes.

---

## 1. Princípios

- **Limpo e financeiro**: muito espaço em branco, cards bem delimitados, hierarquia tipográfica forte para valores monetários.
- **Densidade controlada**: tabelas e cards usam `space-y-4`/`gap-4` como padrão; cards de KPI ficam em grids de 3 ou 4 colunas no desktop.
- **Tom institucional**: cinza neutro como base, amarelo/dourado da marca usado com parcimônia (logo, CTAs, badges de destaque).
- **Estado vazio sempre tratado**: gráfico/listas vazios mostram ilustração + mensagem ("Sem transações para o período").

---

## 2. Tokens (CSS Variables)

Os tokens vivem em [src/shared/styles/globals.css](src/shared/styles/globals.css) (padrão shadcn) e são consumidos via Tailwind ([tailwind.config.ts](tailwind.config.ts#L14-L65)).

### 2.1 Paleta — Light theme

| Token | HSL | Uso |
|---|---|---|
| `--background` | `0 0% 98%` | Fundo da área principal |
| `--foreground` | `222 22% 11%` | Texto primário |
| `--card` | `0 0% 100%` | Fundo de cards |
| `--card-foreground` | `222 22% 11%` | Texto dentro de cards |
| `--muted` | `220 14% 96%` | Fundos sutis (chips, hover) |
| `--muted-foreground` | `220 9% 46%` | Labels e textos secundários |
| `--border` | `220 13% 91%` | Bordas de cards/inputs |
| `--input` | `220 13% 91%` | Borda de inputs |
| `--ring` | `45 96% 56%` | Outline de foco (amarelo da marca) |
| `--primary` | `45 96% 56%` | Amarelo Mutual Pay (CTAs principais, logo) |
| `--primary-foreground` | `222 22% 11%` | Texto sobre primário |
| `--secondary` | `220 14% 96%` | Botões secundários, chips |
| `--accent` | `45 96% 96%` | Hover de itens amarelados |
| `--destructive` | `0 72% 51%` | Erros, PIX out, estornos |
| `--popover` | `0 0% 100%` | Fundo de dropdowns |

### 2.2 Sidebar tokens

A sidebar tem paleta própria (cor cremosa/areia que contrasta com o fundo branco-acinzentado da página):

| Token | HSL | Uso |
|---|---|---|
| `--sidebar-background` | `40 14% 96%` | Fundo da sidebar (creme claro) |
| `--sidebar-foreground` | `222 22% 11%` | Texto dos itens |
| `--sidebar-primary` | `222 22% 11%` | Fundo do item ativo (preto suave) |
| `--sidebar-primary-foreground` | `0 0% 100%` | Texto do item ativo |
| `--sidebar-accent` | `40 10% 92%` | Hover dos itens |
| `--sidebar-border` | `40 10% 88%` | Divisores |

### 2.3 Cores semânticas para chips de ícone

Os mini-cards de KPI usam ícones com fundo colorido de ~12% de opacidade. Padronize via classes utilitárias:

| Categoria | Background | Ícone |
|---|---|---|
| Financeiro/PIX (geral) | `bg-amber-100` | `text-amber-700` |
| Bloqueio/Travado | `bg-rose-100` | `text-rose-600` |
| Saldo consolidado | `bg-sky-100` | `text-sky-700` |
| PIX recebido / sucesso | `bg-emerald-100` | `text-emerald-700` |
| PIX enviado / falha | `bg-red-100` | `text-red-600` |
| Volume / quantidade | `bg-indigo-100` | `text-indigo-700` |
| QR Code / conversão | `bg-violet-100` | `text-violet-700` |
| Reserva / neutro | `bg-muted` | `text-muted-foreground` |

### 2.4 Charts

```css
--chart-1: 142 71% 45%;  /* verde — recebido */
--chart-2: 0 72% 51%;    /* vermelho — enviado */
--chart-3: 38 92% 50%;   /* laranja — estornos */
--chart-4: 217 91% 60%;  /* azul — secundário */
--chart-5: 262 83% 58%;  /* roxo — secundário */
```

---

## 3. Tipografia

Família: **Inter** (com `font-feature-settings: "cv11", "ss01"` habilitando variantes mais geométricas).

| Estilo | Tailwind | Uso |
|---|---|---|
| Page title | `text-3xl font-bold tracking-tight` | "Dashboard", títulos de página |
| Page subtitle | `text-sm text-muted-foreground` | Descrição abaixo do título |
| Section title (card) | `text-base font-semibold` | "Movimentação", "Status das transações" |
| Section description | `text-sm text-muted-foreground` | Linha de apoio do card |
| KPI label | `text-xs text-muted-foreground` | "Saldo Disponível" |
| KPI value (hero) | `text-3xl font-semibold tracking-tight` | `R$ 0,00` grande |
| KPI value (small) | `text-lg font-semibold` | Cards secundários |
| Caption | `text-xs text-muted-foreground` | "PIX", "Cauções e retenções" |
| Badge | `text-[10px] font-semibold uppercase tracking-wide` | "EM BREVE" |

Valores monetários sempre alinhados à esquerda, sem `tabular-nums` salvo em colunas de tabela.

---

## 4. Espaçamento e raios

| Token | Valor | Uso |
|---|---|---|
| `--radius` | `0.75rem` (12px) | Cards, botões grandes |
| `rounded-md` | `calc(--radius - 2px)` = 10px | Inputs, botões padrão |
| `rounded-sm` | `calc(--radius - 4px)` = 8px | Badges, chips de ícone |
| `rounded-full` | — | Avatares, mini-badges |

**Grid e gaps**:
- Grid de KPI hero: `grid-cols-1 md:grid-cols-3 gap-4`
- Grid de KPI secundário: `grid-cols-2 md:grid-cols-4 gap-4`
- Espaçamento vertical entre seções: `space-y-6`
- Padding interno de cards: `p-6` (cabeçalhos `p-6 pb-2`)

---

## 5. Componentes

### 5.1 Sidebar

Estrutura observada na print:

```
┌──────────────────────────┐
│   [Logo Mutual Pay]      │  ← px-6 py-5
├──────────────────────────┤
│  VISÃO USUÁRIO           │  ← uppercase, text-xs, muted-foreground
│  ▣ Visão Geral     (ativo)
│  ⚙ Integração      ›
│  📄 Extratos       ›
│                          │
│  MENU ADMINISTRATIVO     │
│  ▦ Visão Geral      ›
│  ⊞ Operações        ›
│  🏛 Cadastros       ›
│  💰 Gestão Financeira ›
│  🔌 Integrações     ›
│  📊 Relatórios      ›
│  ⚙ Configurações    ›
├──────────────────────────┤
│  [👤] Nivaldeir Integ... │  ← perfil colapsável
│       email@...    ⌃     │
└──────────────────────────┘
```

**Regras**:
- Largura: `w-64` (256px) fixa.
- Item ativo: `bg-sidebar-primary text-sidebar-primary-foreground rounded-md`.
- Item inativo: `text-sidebar-foreground hover:bg-sidebar-accent`.
- Ícone à esquerda (`h-4 w-4 mr-3`), chevron à direita só em itens com submenu.
- Section header: `px-3 pt-6 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground`.
- Avatar do usuário no rodapé: cor de fundo distinta (ex.: `bg-violet-500`) com iniciais brancas.

### 5.2 Topbar

```
┌─────────────────────────────────────────────────────────┐
│ [☰] [👤 Pedro Lucas ⌃]              [🔍 Buscar ⌘K] [↻] [☾]│
│      10.873.687/0001-23                                 │
└─────────────────────────────────────────────────────────┘
```

- `h-14`, `border-b`, `bg-background`, `px-4`.
- À esquerda: toggle da sidebar + seletor de carteira (avatar + nome + CNPJ + chevron). Comporta-se como dropdown.
- À direita: input de busca (`max-w-sm`, com hint `⌘K`), botão de refresh (icon button), toggle de tema (icon button).
- Icon buttons: `h-9 w-9 rounded-md hover:bg-muted`.

### 5.3 Card de KPI Hero

Usado para os 3 grandes valores (Saldo Disponível, Bloqueio Cautelar, Reserva Financeira).

```tsx
<Card className="p-6">
  <div className="flex items-start justify-between">
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">Saldo Disponível</p>
      <p className="text-3xl font-semibold tracking-tight">R$ 0,00</p>
      <p className="text-xs text-muted-foreground">PIX</p>
    </div>
    <div className="rounded-md bg-amber-100 p-2 text-amber-700">
      <DollarSign className="h-4 w-4" />
    </div>
  </div>
</Card>
```

### 5.4 Card de KPI Secundário

Usado para os 4 cards menores em grid (Saldo consolidado, Total movimentado, etc.).

```tsx
<Card className="p-4">
  <div className="flex items-center gap-3">
    <div className="rounded-md bg-sky-100 p-2 text-sky-700">
      <Shield className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Saldo consolidado</p>
      <p className="text-lg font-semibold">R$ 0,00</p>
    </div>
  </div>
</Card>
```

### 5.5 Card de Ação (com badge)

Usado para "Enviar PIX" (com badge **EM BREVE**) e "Ver Extrato".

```tsx
<Card className="p-4 hover:bg-muted/40 transition-colors cursor-pointer">
  <div className="flex items-start justify-between">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-base font-semibold">Enviar PIX</p>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
          EM BREVE
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">Criar transferência</p>
    </div>
    <Send className="h-4 w-4 text-muted-foreground" />
  </div>
</Card>
```

### 5.6 Card de Gráfico

```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="flex items-center gap-2 text-base">
      <TrendingUp className="h-4 w-4 text-emerald-600" />
      Movimentação
    </CardTitle>
    <CardDescription>Volume por tipo de transação (PIX recebido, enviado e estornos).</CardDescription>
  </CardHeader>
  <CardContent>
    {/* chart aqui */}
  </CardContent>
</Card>
```

Estado vazio: ícone de gráfico em `text-muted-foreground/40` + mensagem em `text-sm text-muted-foreground`.

### 5.7 Date range picker (header)

- Botão com `border`, ícone de calendário à esquerda, range formatado "07 fev 2026 – 08 mai 2026" e um `X` para limpar.
- `h-9`, `px-3`, `gap-2`, `text-sm`.

### 5.8 Search input

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-9 pr-12" placeholder="Buscar" />
  <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground border">
    ⌘K
  </kbd>
</div>
```

---

## 6. Estados

| Estado | Convenção |
|---|---|
| Loading | `Loader2` animado em `text-muted-foreground` (já usado em [clients/page.tsx](src/app/(pages)/(private)/(pages)/clients/page.tsx#L221)) |
| Empty (lista) | Bloco centralizado com mensagem + CTA outline para criar |
| Empty (gráfico) | Ícone grande em opacidade reduzida + texto "Sem transações para o período." |
| Disabled | `opacity-50 cursor-not-allowed` |
| Hover (linha de tabela) | `hover:bg-muted/50` |
| Active (sidebar) | `bg-sidebar-primary text-sidebar-primary-foreground` |

---

## 7. Iconografia

- Biblioteca: **lucide-react** (já em uso).
- Tamanho padrão: `h-4 w-4` em chips e botões; `h-5 w-5` em títulos de card.
- Cor herdada do contexto (`currentColor`); não fixar cor exceto nos chips coloridos da seção 2.3.

---

## 8. Acessibilidade

- Todos os botões só com ícone precisam de `aria-label` ou `sr-only`.
- Contraste mínimo AA: `text-muted-foreground` sobre `bg-background` está em ~4.6:1.
- Foco visível: usar `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` (já é o padrão do shadcn).
- `kbd` shortcuts (`⌘K`) devem ter equivalente visível e funcional em teclado.

---

## 9. Tema escuro

A print mostra o toggle de tema (ícone de lua) — preparar variantes para dark:

- `--background`: `222 22% 8%`
- `--card`: `222 22% 11%`
- `--sidebar-background`: `222 22% 9%` (mais escuro que o card)
- Chips de ícone: trocar `*-100` por `*-950/40` e texto por `*-300`.
- Logo: usar variante clara (texto branco) quando `dark`.

---

## 10. Onde colocar o quê

Seguindo [frontend-rules.md](ia/frontend-rules.md):

- Componentes desta print que **são reutilizáveis em outras páginas** (Sidebar, Topbar, KpiCard, ActionCard, ChartCard, DateRangePicker) → `src/shared/components/ui/`.
- Variantes **específicas do dashboard** (composição dos KPIs, layout do grid) → `src/app/(pages)/(private)/(pages)/dashboard/_components/`.
- Tokens/configurações de tema → `src/shared/styles/globals.css`.
- Constantes de cores semânticas dos chips → `src/shared/config/semantic-colors.ts`.
