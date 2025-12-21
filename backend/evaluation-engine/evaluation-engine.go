package evaluationengine

import(
	"fmt"
)

"""
EvaluationEngine is a struct that represents the evaluation engine for the node workflow.

The backend calls the evaluation engine to evaluate the node workflow.
"""
type EvaluationEngine struct{
	Nodes []Node
}