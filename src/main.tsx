import {createRoot} from 'react-dom/client'
// import MarketingPage from "@/marketing-page/MarketingPage";
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '@/shared-theme/AppTheme';
import Routes from "@/routes";

import {SuiClientProvider, WalletProvider} from "@mysten/dapp-kit";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {networkConfig, SUI_NETWORK} from "@/hooks/useSui.ts";

import '@style/index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <>
        <AppTheme>
            <CssBaseline enableColorScheme/>
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider networks={networkConfig} defaultNetwork={SUI_NETWORK}>
                    <WalletProvider autoConnect>
                        <Routes/>
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </AppTheme>
    </>
)
