"""
saroku demo — run this to see behavioral testing in action.
Make sure OPENAI_API_KEY is set.
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from saroku.probe_schemas import ALL_SCHEMAS
from saroku.generators.llm_generator import LLMGenerator
from saroku.core.runner import SarokuRunner
from saroku.core.scorer import compute_scores
from saroku.core.report import print_header, print_probe_results, print_scores
from rich.console import Console

console = Console()

MODEL = os.environ.get("SAROKU_MODEL", "gpt-4o-mini")


def run_demo():
    print_header(MODEL)
    console.print("[dim]This demo runs a small subset of behavioral probes.[/dim]\n")

    # Use a small subset for the demo
    demo_schemas = ALL_SCHEMAS[:6]  # 2 sycophancy + 2 honesty + 2 consistency

    generator = LLMGenerator(generator_model="gpt-4o-mini")
    instances = []
    console.print(f"[dim]Generating {len(demo_schemas)} probe instances...[/dim]")
    for schema in demo_schemas:
        try:
            instance = generator.generate(schema, use_cache=True)
            instances.append(instance)
        except Exception as e:
            console.print(f"[yellow]⚠ Skipping {schema.id}: {e}[/yellow]")

    console.print(f"[dim]Running probes against {MODEL}...[/dim]\n")
    runner = SarokuRunner(model=MODEL, judge_model="gpt-4o-mini")
    results = runner.run_all(instances)

    console.print()
    print_probe_results(results)
    scores = compute_scores(results, MODEL)
    print_scores(scores)


if __name__ == "__main__":
    run_demo()
