export interface ChatMessage {
  from: "xander" | "you" | "claude"
  text: string
}

export interface DialogueReply<NodeId extends string> {
  label: string
  next: NodeId | ""
  requires?: NodeId
}

export interface DialogueNode<NodeId extends string> {
  xander: string
  claude?: string
  replies: readonly DialogueReply<NodeId>[]
}

type DialogueDefinition<Definition> = {
  [NodeId in keyof Definition]: {
    xander: string
    claude?: string
    replies: readonly {
      label: string
      next: Extract<keyof Definition, string> | ""
      requires?: Extract<keyof Definition, string>
    }[]
  }
}

export function defineDialogue<
  const Definition extends DialogueDefinition<Definition>,
>(definition: Definition) {
  return definition as Record<
    Extract<keyof Definition, string>,
    DialogueNode<Extract<keyof Definition, string>>
  >
}

export function assertDialogueGraph<NodeId extends string>(
  dialogue: Record<NodeId, DialogueNode<NodeId>>,
  start: NodeId,
) {
  const reachable = new Set<NodeId>()
  const pending = [start]

  while (pending.length > 0) {
    const nodeId = pending.pop()
    if (!nodeId || reachable.has(nodeId)) continue

    reachable.add(nodeId)
    for (const reply of dialogue[nodeId].replies) {
      if (reply.next && !reachable.has(reply.next)) {
        pending.push(reply.next)
      }
    }
  }

  const unreachable = (Object.keys(dialogue) as NodeId[]).filter(
    nodeId => !reachable.has(nodeId),
  )

  if (unreachable.length > 0) {
    throw new Error(
      `Unreachable Konami dialogue nodes: ${unreachable.join(", ")}`,
    )
  }
}
