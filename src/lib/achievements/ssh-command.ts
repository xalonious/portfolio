import { getSSHVisitorToken } from "./ssh-token"

export const SSH_PORTFOLIO_COMMAND = "ssh term.whoisxander.dev -p 2323"

export async function copySSHCommand(
  writeText: (text: string) => Promise<void> = text => navigator.clipboard.writeText(text),
  getToken: () => string | undefined = getSSHVisitorToken,
): Promise<boolean> {
  try {
    const token = getToken()
    await writeText(token ? `ssh ${token}@term.whoisxander.dev -p 2323` : SSH_PORTFOLIO_COMMAND)
    return true
  } catch { return false }
}
