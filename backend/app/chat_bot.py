from .data import MODEL_PRICING

from anthropic import Anthropic


class ChatBot:
    def __init__(
        self,
        model: str,
        max_tokens: int,
        system_prompt: str = None,
        temperature: float = 1.0,
        cache_system_prompt: bool = False,
    ):
        self.model = model
        self.max_tokens = max_tokens
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.cache_system_prompt = cache_system_prompt
        self.client = Anthropic()
        self.messages = []
        self.usage = {"input_tokens": 0, "output_tokens": 0}

    def _add_message(self, role: str, text: str):
        self.messages.append({"role": role, "content": text})

    def _get_pricing(self):
        if self.model in MODEL_PRICING:
            return MODEL_PRICING[self.model]
        for key, pricing in MODEL_PRICING.items():
            if self.model.startswith(key) or key.startswith(self.model):
                return pricing
        return None

    def _build_params(self):
        params = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "messages": self.messages,
            "temperature": self.temperature,
        }
        if self.system_prompt:
            if self.cache_system_prompt:
                params["system"] = [
                    {
                        "type": "text",
                        "text": self.system_prompt,
                        "cache_control": {"type": "ephemeral"},
                    }
                ]
            else:
                params["system"] = self.system_prompt
        return params

    def chat(self, user_input: str) -> str:
        self._add_message("user", user_input)
        params = self._build_params()

        message = self.client.messages.create(**params)
        response = message.content[0].text
        self.usage["input_tokens"] += message.usage.input_tokens
        self.usage["output_tokens"] += message.usage.output_tokens

        self._add_message("assistant", response)
        return response

    def stream_chat(self, user_input: str):
        """Generator that yields text chunks for streaming responses."""
        self._add_message("user", user_input)
        params = self._build_params()

        response = ""
        with self.client.messages.stream(**params) as stream:
            for text in stream.text_stream:
                response += text
                yield text
            final = stream.get_final_message()
            self.usage["input_tokens"] += final.usage.input_tokens
            self.usage["output_tokens"] += final.usage.output_tokens

        self._add_message("assistant", response)

    def get_usage_summary(self) -> dict:
        input_tokens = self.usage["input_tokens"]
        output_tokens = self.usage["output_tokens"]
        summary = {"input_tokens": input_tokens, "output_tokens": output_tokens}

        pricing = self._get_pricing()
        if pricing:
            input_cost = (input_tokens / 1_000_000) * pricing["input"]
            output_cost = (output_tokens / 1_000_000) * pricing["output"]
            summary["input_cost"] = round(input_cost, 4)
            summary["output_cost"] = round(output_cost, 4)
            summary["total_cost"] = round(input_cost + output_cost, 4)

        return summary

    def reset(self):
        self.messages = []
